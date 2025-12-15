import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Création du contexte
const GameContext = createContext();

// 2. Le Provider (Le composant qui enveloppe tout le jeu)
export const GameProvider = ({ children }) => {

    // --- ÉTATS (STATE) ---

    // Inventaire : Liste d'objets (ex: ['cle_rouillee', 'lampe_uv'])
    const [inventory, setInventory] = useState(() => {
        // On essaie de charger la sauvegarde locale au démarrage
        const saved = localStorage.getItem('disney_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    // Flags : Objet pour suivre la progression (ex: { intro_vue: true, porte_ouverte: false })
    const [flags, setFlags] = useState(() => {
        const saved = localStorage.getItem('disney_flags');
        return saved ? JSON.parse(saved) : {};
    });

    // Salle actuelle
    const [currentRoom, setCurrentRoom] = useState(() => {
        return localStorage.getItem('disney_room') || 'intro';
    });


    // --- ACTIONS (FONCTIONS DE JEU) ---

    // Ajouter un objet (seulement s'il n'est pas déjà là)
    const pickupItem = (itemKey) => {
        if (!inventory.includes(itemKey)) {
            setInventory((prev) => [...prev, itemKey]);
            console.log(`🎁 Objet récupéré : ${itemKey}`);
            return true; // Succès
        }
        return false; // Déjà possédé
    };

    // Retirer/Utiliser un objet
    const useItem = (itemKey) => {
        setInventory((prev) => prev.filter((item) => item !== itemKey));
        console.log(`🗑️ Objet utilisé/perdu : ${itemKey}`);
    };

    // Vérifier si on a un objet
    const hasItem = (itemKey) => inventory.includes(itemKey);

    // Définir une étape de l'histoire (Flag)
    const setGameFlag = (flagKey, value = true) => {
        setFlags((prev) => ({ ...prev, [flagKey]: value }));
        console.log(`🚩 Progression : ${flagKey} = ${value}`);
    };

    // Vérifier une étape (ex: checkFlag('tuto_fini'))
    const checkFlag = (flagKey) => !!flags[flagKey];

    // Changer de salle
    const changeRoom = (roomId) => {
        setCurrentRoom(roomId);
        console.log(`🚪 Changement de salle vers : ${roomId}`);
    };

    // Reset complet (Nouvelle partie)
    const resetGame = () => {
        setInventory([]);
        setFlags({});
        setCurrentRoom('intro');
        localStorage.clear();
    };

    // On expose tout ça au reste de l'app
    const value = {
        inventory,
        flags,
        currentRoom,
        pickupItem,
        useItem,
        hasItem,
        setGameFlag,
        checkFlag,
        changeRoom,
        resetGame
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// 3. Le Hook personnalisé (pour utiliser le contexte facilement)
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGame doit être utilisé à l'intérieur de GameProvider");
    }
    return context;
};