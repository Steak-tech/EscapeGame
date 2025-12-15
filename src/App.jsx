import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SCENARIO_INTRO } from './assets/Script.js'
import DialogueManager from './Components/Dialogue/DialogueManager.jsx'
import DebugPanel from "./Page/DebugPanel.jsx";
import {GameProvider, useGame} from './Context/GameContext.jsx';

function App() {
    const [showDialogue, setShowDialogue] = useState(true);



    const handleDialogueEnd = () => {
        console.log("Dialogue fini ! Le joueur peut maintenant explorer.");
        setShowDialogue(false);
    };

    const Intro = () => {
        const { inventory, pickupItem ,currentRoom, hasItem, setGameFlag} = useGame();

        useEffect(() => {
            if(hasItem('clé anglaise')) {
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
                <Intro />
                <DebugPanel />
            </div>
      </GameProvider>
  )
}

export default App
