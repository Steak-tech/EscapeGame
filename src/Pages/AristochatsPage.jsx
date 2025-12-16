import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../Context/GameContext.jsx';
import DialogueManager from '../Components/Dialogue/DialogueManager';
import bgAristochats from '../assets/Aristochats.png';
import scatCat1 from '../assets/Scat Cat 1.png';
import scatCat2 from '../assets/Scat Cat 2.png';
import scatCat3 from '../assets/Scat Cat 3.png';
import scatCat4 from '../assets/Scat Cat 4.png';
import scatCat5 from '../assets/Scat Cat 5.png';
import musicZone1 from '../assets/Les Aristochats 1.mp3';
import musicZone2 from '../assets/Aristochats 2.mp3';
import musicZone3 from '../assets/Aristochats 3.mp3';
import musicZone4 from '../assets/Aristochats 4.mp3';

// Script de dialogue pour les Aristochats avec les imports d'images
const SCENARIO_ARISTOCHATS = [
    {
        id: 1,
        character: "Scat Cat",
        image: scatCat1,
        text: "Chut... Écoutez.",
        side: "right"
    },
    {
        id: 2,
        character: "Scat Cat",
        image: scatCat2,
        text: "Vous voici dans le salon de musique de Madame de Bonnefamille. D'habitude, on entend ici des gammes maladroites et des rires d'enfants, mais ce soir, le silence est lourd.",
        side: "right"
    },
    {
        id: 3,
        character: "Scat Cat",
        image: scatCat3,
        text: "Les paniers sont renversés. La harpe est seule. Les chatons ont disparu. Pourtant, Berlioz a laissé un indice sur son piano. Il composait un message secret pour appeler à l'aide, caché dans la musique qu'il aime tant.",
        side: "right"
    },
    {
        id: 4,
        character: "Scat Cat",
        image: scatCat4,
        text: "Fouillez les partitions. Retrouvez sa méthode pour traduire les notes en lettres. Puis, tendez l'oreille : la musique vous dira où ils sont enfermés...",
        side: "right"
    },
    {
        id: 5,
        character: "Scat Cat",
        image: scatCat5,
        text: "Vite, je m'en vais ! Bon courage pour trouver le code secret ! N'oubliez pas d'activer le son et de mettre un casque pour bien entendre chaque partition.",
        side: "right"
    }
];

// Configuration des 4 zones cliquables invisibles (rouges temporairement pour le placement)
const clickableZones = [
    {
        id: 1,
        position: { top: '82%', left: '9%' },
        size: { width: '40px', height: '55px' },
    },
    {
        id: 2,
        position: { top: '79%', left: '13%' },
        size: { width: '40px', height: '55px' },
    },
    {
        id: 3,
        position: { top: '76%', left: '17%' },
        size: { width: '40px', height: '55px' },
    },
    {
        id: 4,
        position: { top: '73%', left: '21%' },
        size: { width: '40px', height: '55px' },
    },
];

// Petite zone lumineuse jaune (position et taille facilement ajustables)
const highlightZone = {
    position: { top: '37%', left: '61%' },
    size: { width: '50px', height: '50px' },
};

const AristochatsPage = () => {
    const [showDialogue, setShowDialogue] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingZoneId, setPlayingZoneId] = useState(null);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [codeInput, setCodeInput] = useState('');
    const [codeError, setCodeError] = useState('');
    const navigate = useNavigate();
    const { setGameFlag } = useGame();

    const zoneSounds = {
        1: musicZone1,
        2: musicZone2,
        3: musicZone3,
        4: musicZone4,
    };

    const playZoneMusic = (zoneId) => {
        if (isPlaying) return; // on bloque le spam clique tant qu'une musique joue

        const src = zoneSounds[zoneId];
        if (!src) return;

        const audio = new Audio(src);
        setIsPlaying(true);
        setPlayingZoneId(zoneId);

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setPlayingZoneId(null);
        });

        audio.play().catch(() => {
            // évite de crasher si le navigateur bloque l'autoplay
            setIsPlaying(false);
            setPlayingZoneId(null);
        });
    };

    const handleDialogueEnd = () => {
        setShowDialogue(false);
    };

    const handleZoneClick = (zoneId) => {
        console.log(`Zone ${zoneId} cliquée`);
        playZoneMusic(zoneId);
        // Ici tu pourras ajouter la logique pour chaque zone (popup, énigme, etc.)
    };

    const handleHighlightClick = () => {
        if (isPlaying) return;
        setShowCodeModal(true);
        setCodeError('');
        setCodeInput('');
    };

    const handleValidateCode = () => {
        const normalized = codeInput.trim().toUpperCase();
        if (normalized === 'CAGE') {
            setGameFlag('zone_aristochats_done', true);
            setShowCodeModal(false);
            navigate('/map');
        } else {
            setCodeError('Code incorrect. Essaie encore en observant bien la scène.');
        }
    };

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-black text-amber-50"
            style={{ userSelect: 'none' }}
        >
            {/* Fond Aristochats */}
            <img
                src={bgAristochats}
                alt="Les Aristochats"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Voile sombre pour lisibilité */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Contenu principal */}
            <div className="relative z-10 w-full h-full">
                {/* Dialogue d'intro */}
                {showDialogue && (
                    <DialogueManager
                        script={SCENARIO_ARISTOCHATS}
                        onComplete={handleDialogueEnd}
                        backgroundColor="blue"
                    />
                )}

                {/* Zone de jeu (visible seulement après le dialogue) */}
                {!showDialogue && (
                    <div className="absolute inset-0">
                        {/* Indicateur de musique en cours */}
                        {isPlaying && (
                            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/70 border border-amber-400/70 text-xs text-amber-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Musique en cours...</span>
                            </div>
                        )}

                        {/* Petite zone lumineuse jaune (cliquable) */}
                        <button
                            type="button"
                            onClick={handleHighlightClick}
                            className="absolute focus:outline-none focus-visible:outline-none"
                            style={{
                                top: highlightZone.position.top,
                                left: highlightZone.position.left,
                                transform: 'translate(-50%, -50%)',
                                width: highlightZone.size.width,
                                height: highlightZone.size.height,
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                            }}
                        >
                            <div
                                className="w-full h-full rounded-full bg-yellow-300/70 blur-md shadow-[0_0_30px_rgba(250,204,21,0.9)] animate-pulse"
                            />
                        </button>

                        {/* 4 zones cliquables invisibles */}
                        {clickableZones.map((zone) => (
                            <button
                                key={zone.id}
                                type="button"
                                onClick={() => handleZoneClick(zone.id)}
                                className="absolute focus:outline-none focus-visible:outline-none"
                                style={{
                                    top: zone.position.top,
                                    left: zone.position.left,
                                    transform: 'translate(-50%, -50%)',
                                    width: zone.size.width,
                                    height: zone.size.height,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                                    opacity: isPlaying ? 0.5 : 1,
                                }}
                                disabled={isPlaying}
                            >
                                {/* Zone totalement invisible */}
                            </button>
                        ))}
                        {/* Popup de code pour la lumière */}
                        {showCodeModal && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70">
                                <div className="bg-slate-900/90 border border-amber-400/70 rounded-xl shadow-2xl px-5 py-4 w-11/12 max-w-md text-amber-50 relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCodeModal(false)}
                                        className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-500"
                                    >
                                        ×
                                    </button>
                                    <h3 className="text-lg font-bold mb-2">Entrer le code</h3>
                                    <p className="text-sm mb-3">
                                        Une cage dorée semble briller au rythme de la musique...
                                        Entre le mot secret pour déverrouiller le passage.
                                    </p>
                                    <input
                                        type="text"
                                        value={codeInput}
                                        onChange={(e) => {
                                            setCodeInput(e.target.value);
                                            setCodeError('');
                                        }}
                                        className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-600 text-amber-50 text-sm mb-2 outline-none focus:border-amber-400"
                                        placeholder="Code..."
                                    />
                                    {codeError && (
                                        <p className="text-xs text-red-400 mb-2">{codeError}</p>
                                    )}
                                    <div className="flex justify-end gap-2 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowCodeModal(false)}
                                            className="px-3 py-1.5 rounded-md text-xs bg-slate-800 text-slate-100 hover:bg-slate-700"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleValidateCode}
                                            className="px-4 py-1.5 rounded-md text-xs bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300"
                                        >
                                            Valider
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AristochatsPage;

