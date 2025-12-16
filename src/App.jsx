import { useEffect, useState } from 'react'
import './App.css'
import DialogueManager from './Components/Dialogue/DialogueManager.jsx'
import DebugPanel from "./Page/DebugPanel.jsx";
import { GameProvider, useGame } from './context/GameContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { SCENARIO_INTRO } from './assets/Script.js';
import MapPuzzle from './Components/MapPuzzle.jsx';
import FullMapPage from './Pages/FullMapPage.jsx';
import PinocchioPage from './Pages/PinocchioPage.jsx';

export default function App() {
    const [showDialogue, setShowDialogue] = useState(true);
    const [showMapPuzzle, setShowMapPuzzle] = useState(false);
    const navigate = useNavigate();



    const handleDialogueEnd = () => {
        console.log("Dialogue fini ! Le joueur peut maintenant explorer.");
        setShowDialogue(false);
        setShowMapPuzzle(true);
    };

    const handleOpenFullMap = () => {
        // Redirection vers la vraie page /map
        setShowMapPuzzle(false);
        navigate('/map');
    };
    const Intro = () => {
        const { inventory, pickupItem, currentRoom, hasItem, setGameFlag } = useGame();

        useEffect(() => {
            if (hasItem('clé anglaise')) {
                setGameFlag('intro_has_cle_anglaise', true);
            }
        }, [inventory]);

        console.log("Inventaire actuel :", inventory);
        console.log("Salle actuelle :", currentRoom);

        return (
            <div>
                <img src="src/assets/AtelierV2.png" alt="Background" className="w-full h-full object-cover fixed top-0 left-0 z-0" />
                {showDialogue && <DialogueManager script={SCENARIO_INTRO} onComplete={handleDialogueEnd} />}
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                    <button
                        onClick={() => {
                            pickupItem("clé anglaise");
                        }}
                        className={`px-6 py-3 bg-blue-600 text-white font-bold rounded ${showDialogue ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        disabled={showDialogue}
                    >
                        Explorer l'atelier
                    </button>
                </div>
                {showMapPuzzle && (
                    <MapPuzzle onOpenFullMap={handleOpenFullMap} />
                )}
                {hasItem("clé anglaise") ? (
                    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-10 bg-white/80 p-4 rounded">
                        <p className="text-black font-bold">Vous avez récupéré la clé anglaise !</p>
                    </div>
                ) : null}
            </div>
        )
    }


    return (
        <GameProvider>
            <div className="App">
                <DebugPanel />
            </div>
            <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/map" element={<FullMapPage />} />
                <Route path="/zone/pinocchio" element={<PinocchioPage />} />
            </Routes>
        </GameProvider>
    )
}


