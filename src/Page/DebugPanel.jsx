import { useGame } from '../Context/GameContext';

const DebugPanel = () => {
    const { inventory, flags, currentRoom, resetGame, hasNavigated, closeMap } = useGame();

    return (
        <div className="fixed top-0 right-0 p-4 bg-black/80 text-green-400 font-mono text-xs z-[9999] border-l border-green-500 max-w-xs">
            <h3 className="font-bold border-b border-green-500 mb-2">🧠 GAME STATE</h3>

            <p>📍 Room: <span className="text-white">{currentRoom}</span></p>

            <div className="mt-2">
                <p>🎒 Inventaire ({inventory.length}) :</p>
                <ul className="list-disc pl-4 text-white/80">
                    {inventory.map(i => <li key={i}>{i}</li>)}
                </ul>
            </div>

            <div className="mt-2">
                <p>🚩 Flags :</p>
                <pre className="text-[10px] text-white/80">
                    {JSON.stringify(flags, null, 2)}
                </pre>
            </div>

            <div className="border-t border-green-500 mt-2 pt-2">
                <p>🗺️ closeMap :</p>
                {JSON.stringify(closeMap, null, 2)}
            </div>


            <button
                onClick={resetGame}
                className="mt-4 w-full bg-red-900/50 border border-red-500 text-red-300 py-1 hover:bg-red-900"
            >
                RESET SAVE
            </button>
        </div>
    );
};

export default DebugPanel;