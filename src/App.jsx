import { useEffect, useState } from 'react'
import './App.css'
import DialogueManager from './Components/Dialogue/DialogueManager.jsx'
import DebugPanel from "./Page/DebugPanel.jsx";
import { GameProvider, useGame } from './Context/GameContext.jsx';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { SCENARIO_INTRO } from './assets/Script.js';
import MapPuzzle from './Components/MapPuzzle.jsx';
import FullMapPage from './Pages/FullMapPage.jsx';
import PinocchioPage from './Pages/PinocchioPage.jsx';
import AristochatsPage from './Pages/AristochatsPage.jsx';
import LionPage from './Pages/LionPage.jsx';
import WallEPage from './Pages/WallEPage.jsx';
import ChateauPage from './Pages/ChateauPage.jsx';
import DoorTransition from "./Page/DoorTransition.jsx";

export default function App() {
    const [showDialogue, setShowDialogue] = useState(true);
    const [showMapPuzzle, setShowMapPuzzle] = useState(true);
    const navigate = useNavigate();

    const handleOpenFullMap = () => {
        navigate('/map');
    };
    const Intro = () => {
        const { inventory, pickupItem, currentRoom, hasItem, setGameFlag, checkFlag } = useGame();

        const handleDialogueEnd = () => {
            console.log("Dialogue fini ! Le joueur peut maintenant explorer.");
            setShowDialogue(false);
            setShowMapPuzzle(true)
            setGameFlag('intro_dialogue_completed', true);
        };

        console.log("Inventaire actuel :", inventory);
        console.log("Salle actuelle :", currentRoom);

        return (
            <div>
                <img src="src/assets/AtelierV2.png" alt="Background" className="w-full h-full object-cover fixed top-0 left-0 z-0" />
                {showDialogue && !checkFlag('intro_dialogue_completed') && <DialogueManager script={SCENARIO_INTRO} onComplete={handleDialogueEnd} backgroundColor="orange" />}
                {showMapPuzzle && !hasItem('carte_complete') && (
                    <MapPuzzle onOpenFullMap={handleOpenFullMap} />
                )}
            </div>
        )
    }


    return (
        <GameProvider>
            <div className="App">

            </div>
            <Routes>
                <Route path="/" element={<DoorTransition />} />
                <Route path="/atelier" element={<Intro />} />
                <Route path="/map" element={<FullMapPage />} />
                <Route path="/zone/pinocchio" element={<PinocchioPage />} />
                <Route path="/zone/aristochats" element={<AristochatsPage />} />
                <Route path="/zone/lion" element={<LionPage />} />
                <Route path="/zone/walle" element={<WallEPage />} />
                <Route path="/zone/chateau" element={<ChateauPage />} />
            </Routes>
        </GameProvider>
    )
}


