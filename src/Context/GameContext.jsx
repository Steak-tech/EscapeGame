import React, {createContext, useContext, useState, useEffect, useRef} from 'react';
import MapShow from "../Components/MapShow.jsx";
import DebugPanel from "../Page/DebugPanel.jsx";
import Notification from "../Components/Notification.jsx"; // ✅ IMPORT
import { Howl, Howler } from 'howler';


// --- DICTIONNAIRE DES NOMS D'OBJETS ---
const ITEMS_NAMES = {
    carte_complete: "Carte du Parc",
    cle_porte: "Clé de la Porte",
};

import musicWalle from '../assets/music/walle.mp3';
import musicLion from '../assets/music/lion.mp3';
import musicPinocchio from '../assets/music/pinocchio.mp3';
import musicAristochats from '../assets/music/aristochats.mp3';
import musicIntro from '../assets/music/intro.wav';

const GameContext = createContext();

export const GameProvider = ({ children }) => {

    // ... tes états existants (inventory, flags, currentRoom...) ...
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('disney_inventory');
        return saved ? JSON.parse(saved) : [];
    });
    const [flags, setFlags] = useState(() => {
        const saved = localStorage.getItem('disney_flags');
        return saved ? JSON.parse(saved) : {};
    });
    const [currentRoom, setCurrentRoom] = useState(() => {
        return localStorage.getItem('disney_room') || 'intro';
    });
    const [hasNavigated, setHasNavigated] = useState(false);
    const [closeMap, setCloseMap] = useState(false);

    // --- ✅ NOUVEL ÉTAT POUR LA NOTIFICATION ---
    const [notificationMessage, setNotificationMessage] = useState(null);

    // ... tes useEffects de sauvegarde (inchangés) ...
    useEffect(() => { localStorage.setItem('disney_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('disney_flags', JSON.stringify(flags)); }, [flags]);
    useEffect(() => { localStorage.setItem('disney_room', currentRoom); }, [currentRoom]);

    // --- PERSISTANCE DANS LOCALSTORAGE ---
    useEffect(() => {
        localStorage.setItem('disney_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('disney_flags', JSON.stringify(flags));
    }, [flags]);

    useEffect(() => {
        localStorage.setItem('disney_room', currentRoom);
    }, [currentRoom]);

    const musicRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    // --- FONCTION PLAY MUSIC ---
    const playMusic = (musicType) => {
        // 1. Déterminer quelle source jouer
        let src = null;
        switch (musicType) {
            case 'intro': src = musicIntro; break; // Pas de musique pour l'intro
            case 'pinocchio': src = musicPinocchio; break;
            case 'aristochats': src = musicAristochats; break;
            case 'lion': src = musicLion; break;
            case 'walle': src = musicWalle; break; // ✅ AJOUT DU CAS WALL-E
            default: console.warn("Musique inconnue:", musicType); return;
        }

        // 2. Vérifier si c'est déjà la même musique qui joue
        if (musicRef.current && musicRef.current._src && musicRef.current._src.includes(src)) {
            return; // On ne fait rien, ça joue déjà
        }

        // 3. Fade Out de l'ancienne musique (Transition douce)
        if (musicRef.current) {
            const oldMusic = musicRef.current;
            oldMusic.fade(oldMusic.volume(), 0, 1000); // Baisse le volume en 1s
            setTimeout(() => oldMusic.stop(), 1000);
        }

        // 4. Lancer la nouvelle musique
        const newMusic = new Howl({
            src: [src],
            loop: true,
            volume: 0,      // On commence à 0 pour le Fade In
            html5: true,    // Important pour le streaming des gros fichiers
            muted: isMuted  // On respecte l'état mute global
        });

        newMusic.play();
        newMusic.fade(0, 0.5, 2000); // Monte le volume à 0.5 en 2s
        musicRef.current = newMusic;
    };

    const stopMusic = (duration = 1000) => {
        if (musicRef.current) {
            const sound = musicRef.current;

            // On fait un fondu vers 0
            sound.fade(sound.volume(), 0, duration);

            // On arrête vraiment le son après le fondu
            setTimeout(() => {
                sound.stop();
                // On nettoie la référence seulement si c'est toujours le même son
                if (musicRef.current === sound) {
                    musicRef.current = null;
                }
            }, duration);
        }
    };

    const editCloseMap = (value) => { setCloseMap(value); }

    const pickupItem = (itemKey) => {
        if (!inventory.includes(itemKey)) {
            setInventory((prev) => [...prev, itemKey]);
            console.log(`🎁 Objet récupéré : ${itemKey}`);

            const prettyName = ITEMS_NAMES[itemKey] || itemKey;
            setNotificationMessage(prettyName);

            return true;
        }
        return false;
    };

    // ... autres fonctions (useItem, hasItem, setGameFlag...) inchangées ...
    const useItem = (itemKey) => { setInventory((prev) => prev.filter((item) => item !== itemKey)); };
    const hasItem = (itemKey) => inventory.includes(itemKey);
    const setGameFlag = (flagKey, value = true) => { setFlags((prev) => ({ ...prev, [flagKey]: value })); };
    const checkFlag = (flagKey) => !!flags[flagKey];
    const changeRoom = (roomId) => { setCurrentRoom(roomId); };
    const resetGame = () => { setInventory([]); setFlags({}); setCurrentRoom('intro'); localStorage.clear(); };
    const navigateOnce = () => { if (!hasNavigated) { setHasNavigated(true); return true; } return false; }
    const editNavigation = (value) => { setHasNavigated(value); }
    const resetNavigation = () => { setHasNavigated(false); }


    const value = {
        inventory, flags, currentRoom, pickupItem, useItem, hasItem, setGameFlag, checkFlag, changeRoom, resetGame, navigateOnce, hasNavigated,setHasNavigated, resetNavigation, editNavigation, closeMap, setCloseMap, editCloseMap,playMusic, stopMusic, setIsMuted
    };

    return (
        <GameContext.Provider value={value}>

            {/* ✅ AFFICHAGE DE LA NOTIFICATION AU DESSUS DE TOUT */}
            <Notification
                message={notificationMessage}
                onClose={() => setNotificationMessage(null)}
            />

            {hasItem('carte_complete') &&
                <MapShow />
            }
            <div
                className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition"
                onClick={() => {
                    setIsMuted((prev) => {
                        const newMuteState = !prev;
                        Howler.mute(newMuteState);
                        return newMuteState;
                    });
                }}
                title={isMuted ? "Activer le son" : "Désactiver le son"}
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" class="bi bi-volume-mute-fill" viewBox="0 0 16 16">
                        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green"
                         className="bi bi-volume-up-fill" viewBox="0 0 16 16">
                        <path
                            d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                        <path
                            d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                        <path
                            d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
                    </svg>
                )}
            </div>
            <DebugPanel />

            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame doit être utilisé à l'intérieur de GameProvider");
    }
    return context;
};