import React, { createContext, useContext, useState, useEffect } from 'react';
import MapShow from "../Components/MapShow.jsx";
import DebugPanel from "../Page/DebugPanel.jsx";
import Notification from "../Components/Notification.jsx"; // ✅ IMPORT

// --- DICTIONNAIRE DES NOMS D'OBJETS ---
const ITEMS_NAMES = {
    carte_complete: "Carte du Parc",
};

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


    // --- ACTIONS MODIFIÉES ---

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
        inventory, flags, currentRoom, pickupItem, useItem, hasItem, setGameFlag, checkFlag, changeRoom, resetGame, navigateOnce, hasNavigated,setHasNavigated, resetNavigation, editNavigation, closeMap, setCloseMap, editCloseMap,
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
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) { throw new Error("useGame doit être utilisé à l'intérieur de GameProvider"); }
    return context;
};