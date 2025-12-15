import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { SCENARIO_INTRO } from './assets/Script.js';
import DialogueManager from './Components/Dialogue/DialogueManager.jsx';
import MapPuzzle from './Components/MapPuzzle.jsx';
import FullMapPage from './Pages/FullMapPage.jsx';

function HomePage() {
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

    return (
        <div className="">
            <div className="relative">
                <img
                    src="src/assets/AtelierV2.png"
                    alt="Disneyland"
                    className="w-full h-screen object-cover"
                />

                {/* Morceaux de carte + popup, seulement après le dialogue */}
                {showMapPuzzle && (
                    <MapPuzzle onOpenFullMap={handleOpenFullMap} />
                )}
            </div>

            {showDialogue && (
                <DialogueManager
                    script={SCENARIO_INTRO}
                    onComplete={handleDialogueEnd}
                />
            )}
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<FullMapPage />} />
        </Routes>
    );
}

export default App;


