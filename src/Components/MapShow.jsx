import React, { useRef, useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {useGame} from "../Context/GameContext.jsx";
import mapIconImg from '../assets/mapIcon.png';

// --- 1. IMPORTATION DES DEUX SÉQUENCES ---

// Fonction utilitaire pour trier les URLs (évite de dupliquer le code)
const getSortedUrls = (glob) => {
    return Object.keys(glob)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .map(key => glob[key]);
};

// Récupération des fichiers
const framesInGlob = import.meta.glob('/src/assets/MapIn/*.png', { eager: true, as: 'url' });
const framesOutGlob = import.meta.glob('/src/assets/MapOut/*.png', { eager: true, as: 'url' });

const framesInUrls = getSortedUrls(framesInGlob);
const framesOutUrls = getSortedUrls(framesOutGlob);

const MapSequence = ({
                         fps = 120,
                         width = 1920,
                         height = 1080
                     }) => {
    const canvasRef = useRef(null);

    // États pour stocker les images préchargées
    const [imagesIn, setImagesIn] = useState([]);
    const [imagesOut, setImagesOut] = useState([]);
    const [areImagesLoaded, setAreImagesLoaded] = useState(false);

    // État principal de l'interface : 'CLOSED', 'OPENING', 'OPEN', 'CLOSING'
    const [uiState, setUiState] = useState('CLOSED');
    const navigate = useNavigate();

    const { navigateOnce, hasNavigated, closeMap, editCloseMap } = useGame();

    // --- A. PRÉCHARGEMENT DE TOUTES LES IMAGES (IN & OUT) ---
    useEffect(() => {
        let loadedCount = 0;
        const total = framesInUrls.length + framesOutUrls.length;

        const loadImages = (urls) => {
            return urls.map(url => {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === total) setAreImagesLoaded(true);
                };
                return img;
            });
        };

        setImagesIn(loadImages(framesInUrls));
        setImagesOut(loadImages(framesOutUrls));
    }, []);

    // --- GESTIONNAIRES DE CLIC ---
    const handleOpenMap = () => {
        if (uiState === 'CLOSED' && areImagesLoaded) {
            setUiState('OPENING');
        }
    };

    const handleCloseMap = () => {
        console.log("Vérification de la demande de fermeture de la carte :", closeMap);
        if (closeMap){
            setUiState('CLOSING');
            editCloseMap(false);
            console.log("Fermeture de la carte demandée depuis le contexte du jeu.");
        }
    };

    useEffect(() => {
        console.log("Effect triggered: closeMap is now", closeMap);
        if (closeMap && uiState === 'OPEN') { // Check if map is actually open
            console.log("Closing map due to context trigger.");
            setUiState('CLOSING');
            editCloseMap(false); // Reset the flag immediately
        }
    }, [closeMap, uiState, editCloseMap]);

    // --- B. BOUCLE D'ANIMATION UNIQUE ---
    useEffect(() => {
        handleCloseMap()
        // On ne fait rien si on est statique (fermé ou ouvert sans bouger)
        if (uiState === 'CLOSED' || uiState === 'OPEN' || !areImagesLoaded) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // On détermine quelle séquence jouer selon l'état
        const currentSequence = uiState === 'OPENING' ? imagesIn : imagesOut;

        let frameIndex = 0;
        let animationId;
        let lastTime = 0;
        const interval = 1000 / fps;

        const draw = (currentTime) => {
            animationId = requestAnimationFrame(draw);

            const deltaTime = currentTime - lastTime;
            if (deltaTime < interval) return;

            lastTime = currentTime - (deltaTime % interval);

            ctx.clearRect(0, 0, width, height);

            if (currentSequence[frameIndex]) {
                ctx.drawImage(currentSequence[frameIndex], 0, 0, width, height);
            }

            frameIndex++;

            // FIN DE L'ANIMATION
            if (frameIndex >= currentSequence.length) {
                cancelAnimationFrame(animationId);

                // Transition d'état à la fin de l'animation
                if (uiState === 'OPENING') {
                    // L'ouverture est finie -> On passe en état OUVERT (fixe)
                    setUiState('OPEN');
                    navigate('/map')
                    navigateOnce()
                    setUiState('CLOSED');
                } else if (uiState === 'CLOSING') {
                    // La fermeture est finie -> On passe en état FERMÉ
                    setUiState('CLOSED');
                    ctx.clearRect(0, 0, width, height); // On nettoie tout
                }
            }
        };

        animationId = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(animationId);
    }, [uiState, areImagesLoaded, imagesIn, imagesOut, fps, width, height, closeMap]);

    return (
        <>
            {/* 1. ICONE D'OUVERTURE (Visible seulement si fermé) */}
            {uiState === 'CLOSED' && !hasNavigated &&   (
                <div onClick={handleOpenMap} className="cursor-pointer select-none">
                    <img
                        src={mapIconImg}
                        draggable="false"
                        alt='Open map'
                        className='absolute top-2 left-4 w-40 z-20 cursor-pointer'
                    />
                </div>
            )}

            {/* 2. CROIX DE FERMETURE (Visible seulement si la map est totalement ouverte) */}
            {uiState === 'OPEN' && (
                <button
                    onClick={handleCloseMap}
                    className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center font-bold text-xl transition-all"
                >
                    ✕
                </button>
            )}

            {/* 3. LE CANVAS (Visible sauf si fermé) */}
            <div className={`absolute inset-0 flex items-center justify-center z-1000 pointer-events-none ${uiState === 'CLOSED' ? 'hidden' : 'block'}`}>
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="w-full h-full object-contain"
                />
            </div>
        </>
    );
};

export default MapSequence;