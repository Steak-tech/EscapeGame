import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Coffre from "./Components/Lottie.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <Coffre />
    </div>
  )
}

export default App
