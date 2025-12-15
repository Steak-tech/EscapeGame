import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SCENARIO_INTRO } from './assets/Script.js'
import DialogueManager from './Components/Dialogue/DialogueManager.jsx'

function App() {
    const [showDialogue, setShowDialogue] = useState(true);

    const handleDialogueEnd = () => {
        console.log("Dialogue fini ! Le joueur peut maintenant explorer.");
        setShowDialogue(false);
    };
  return (
    <div className="">
        <div className='relative'>
            <img src='src/assets/AtelierV2.png' alt='Disneyland' className='w-full h-screen object-cover'/>
        </div>
        {showDialogue && (
            <DialogueManager
                script={SCENARIO_INTRO}
                onComplete={handleDialogueEnd}
            />
        )}
    </div>
  )
}

export default App
