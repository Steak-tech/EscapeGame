import { useEffect, useState } from 'react'
import './App.css'
import DialogueManager from './Components/Dialogue/DialogueManager.jsx'
import DebugPanel from "./Page/DebugPanel.jsx";
import { GameProvider, useGame } from './context/GameContext';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SCENARIO_INTRO } from './assets/Script.js';
import MapPuzzle from './Components/MapPuzzle.jsx';
import FullMapPage from './Pages/FullMapPage.jsx';
import PinocchioPage from './Pages/PinocchioPage.jsx';
import DoorTransition from "./Page/DoorTransition.jsx";
import MapShow from "./Components/MapShow.jsx";

export default function App() {
    const [showDialogue, setShowDialogue] = useState(true);
    const [showMapPuzzle, setShowMapPuzzle] = useState(false);
    const navigate = useNavigate();



    const Intro = () => {
        const { inventory, pickupItem ,currentRoom, hasItem, setGameFlag, checkFlag} = useGame();

        const handleDialogueEnd = () => {
            console.log("Dialogue fini ! Le joueur peut maintenant explorer.");
            setShowDialogue(false);
            setShowMapPuzzle(true);
            setGameFlag('intro_dialogue_completed', true);
        };

        console.log("Inventaire actuel :", inventory);
        console.log("Salle actuelle :", currentRoom);

        return (
            <div>
                <img src="src/assets/AtelierV2.png" alt="Background" className="w-full h-full object-cover fixed top-0 left-0 z-0" />
                {showDialogue && !checkFlag('intro_dialogue_completed') ? <DialogueManager script={SCENARIO_INTRO} onComplete={handleDialogueEnd} />: setShowMapPuzzle(true)}
                {showMapPuzzle && (
                    <MapPuzzle />
                )}
            </div>
        )
    }


    return (
        <GameProvider>
            <DebugPanel />
            <Routes>
                <Route path="/" element={<DoorTransition />} />
                <Route path="/atelier" element={<Intro />} />
                <Route path="/map" element={<FullMapPage />} />
                <Route path="/zone/pinocchio" element={<PinocchioPage />} />
            </Routes>
        </GameProvider>
    );
}


