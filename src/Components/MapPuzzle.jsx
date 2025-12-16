import React, { useState, useEffect } from 'react';

const piecesConfig = [
    {
        id: 1,
        question: "Trouver l'année de naissance de Walt Disney. Code : 1901",
        answer: '1901',
        position: { top: '25%', left: '10%' },
    },
    {
        id: 2,
        question: 'Trouver le prénom OSWALD',
        answer: 'oswald',
        position: { top: '20%', left: '45%' },
    },
    {
        id: 3,
        question: 'Trouver le code ALICE',
        answer: 'alice',
        position: { top: '80%', left: '60%' },
    },
];

// Zones cliquables (indices) placées sur le fond
const cluesConfig = [
    {
        id: 1,
        image: 'src/assets/indice1.png',
        position: { top: '60%', left: '37%' },
        size: { width: '8%', height: '20%' },
    },
    {
        id: 2,
        image: 'src/assets/indice2.png',
        position: { top: '53%', left: '50%' },
        size: { width: '8%', height: '10%' },
    },
    {
        id: 3,
        image: 'src/assets/indice3.png',
        position: { top: '63%', left: '51%' },
        size: { width: '10%', height: '10%' },
    },
];

const MapPuzzle = ({ onComplete, onOpenFullMap }) => {
    const [foundPieces, setFoundPieces] = useState({});
    const [activePieceId, setActivePieceId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [activeClueId, setActiveClueId] = useState(null);

    // Vérifie si toutes les pièces sont trouvées
    useEffect(() => {
        const allFound =
            piecesConfig.every(piece => foundPieces[piece.id]) &&
            Object.keys(foundPieces).length === piecesConfig.length;

        if (allFound && !isCompleted) {
            setIsCompleted(true);
            if (onComplete) onComplete();
        }
    }, [foundPieces, isCompleted, onComplete]);

    const handlePieceClick = (id) => {
        if (foundPieces[id] || isCompleted) return;
        setActivePieceId(id);
        setInputValue('');
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!activePieceId) return;

        const piece = piecesConfig.find(p => p.id === activePieceId);
        if (!piece) return;

        const expected = piece.answer.trim().toLowerCase();
        const given = inputValue.trim().toLowerCase();

        if (given === expected) {
            setFoundPieces(prev => ({ ...prev, [activePieceId]: true }));
            setActivePieceId(null);
            setInputValue('');
            setError('');
        } else {
            setError("Mauvaise réponse, essaie encore !");
        }
    };

    const activePiece = piecesConfig.find(p => p.id === activePieceId);
    const activeClue = cluesConfig.find(c => c.id === activeClueId);

    if (isCompleted) {
        // "Nouvelle page" : affichage plein écran de la carte réelle en grand (sans indices supplémentaires)
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="relative w-11/12 max-w-6xl h-[85vh] bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-amber-500/60">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-700 to-emerald-800 opacity-70" />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 md:p-8 gap-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-amber-100 drop-shadow-lg tracking-wide">
                            Carte complète récupérée
                        </h2>
                        <p className="text-amber-100/80 max-w-2xl text-sm md:text-base">
                            Les trois morceaux manquants de la carte ont été rassemblés.
                            Une nouvelle zone de Disneyland oublié s'ouvre devant toi...
                        </p>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    if (onOpenFullMap) onOpenFullMap();
                                }}
                                className="relative group focus:outline-none"
                            >
                                <img
                                    src="src/assets/MapStudios.png"
                                    alt="Carte complète des Walt Disney Studios"
                                    className="max-h-[60vh] w-auto rounded-lg shadow-2xl object-contain group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                                />
                                <span className="absolute inset-x-0 bottom-3 text-center text-xs md:text-sm text-amber-50/90 bg-black/50 px-3 py-1 rounded-full mx-auto w-fit">
                                    Cliquer pour ouvrir la carte en page complète
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Morceaux de carte cliquables */}
            {piecesConfig.map(piece => {
                const found = foundPieces[piece.id];
                return (
                    <button
                        key={piece.id}
                        type="button"
                        onClick={() => handlePieceClick(piece.id)}
                        className={`
                            absolute z-40
                            transition-transform transition-colors duration-300
                            ${found ? 'opacity-60 cursor-default' : 'hover:scale-105 hover:brightness-110 cursor-pointer'}
                        `}
                        style={{
                            top: piece.position.top,
                            left: piece.position.left,
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <svg
                            width="120"
                            height="90"
                            viewBox="0 0 120 90"
                            className="drop-shadow-lg"
                        >
                            <defs>
                                <linearGradient id={`piece-bg-${piece.id}`} x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor={found ? '#d1d5db' : '#fed7aa'} />
                                    <stop offset="100%" stopColor={found ? '#9ca3af' : '#fdba74'} />
                                </linearGradient>
                            </defs>
                            <rect
                                x="4"
                                y="4"
                                width="112"
                                height="82"
                                rx="10"
                                fill={`url(#piece-bg-${piece.id})`}
                                stroke="#78350f"
                                strokeWidth="2"
                            />
                            <path
                                d="M10 20 Q40 10 70 25 T110 30"
                                fill="none"
                                stroke="#92400e"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            />
                            <text
                                x="60"
                                y="55"
                                textAnchor="middle"
                                fill="#7c2d12"
                                fontSize="22"
                                fontFamily="serif"
                            >
                                {found ? 'OK' : `Carte ${piece.id}`}
                            </text>
                        </svg>
                    </button>
                );
            })}

            {/* Popup / Modal de question */}
            {activePiece && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-11/12 max-w-md bg-slate-900 rounded-xl p-6 shadow-2xl border border-amber-500/60">
                        <h3 className="text-lg font-bold mb-3 text-amber-100">
                            Carte {activePiece.id}
                        </h3>
                        <p className="text-sm text-amber-50/90 mb-4">
                            {activePiece.question}
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                className="w-full rounded-md px-3 py-2 bg-slate-800 text-amber-50 outline-none border border-slate-600 focus:border-amber-400"
                                placeholder="Entre le code ici"
                            />
                            {error && (
                                <p className="text-red-400 text-xs">
                                    {error}
                                </p>
                            )}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActivePieceId(null);
                                        setError('');
                                    }}
                                    className="px-3 py-1.5 text-xs rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs rounded-md bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400"
                                >
                                    Valider
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Zones cliquables pour indices AVANT d'avoir les 3 morceaux */}
            {cluesConfig.map(clue => (
                <button
                    key={clue.id}
                    type="button"
                    onClick={() => setActiveClueId(clue.id)}
                    className="absolute z-30 cursor-pointer"
                    style={{
                        top: clue.position.top,
                        left: clue.position.left,
                        transform: 'translate(-50%, -50%)',
                        width: clue.size?.width ?? '10%',
                        height: clue.size?.height ?? '10%',
                    }}
                >
                    {/* Zone (actuellement visible en rouge pour le placement) */}
                </button>
            ))}

            {/* Popup d'indice (image) */}
            {activeClue && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
                    <div className="relative rounded-xl shadow-2xl  p-3 md:p-4">
                        {/* Bouton fermer */}
                        <button
                            type="button"
                            onClick={() => setActiveClueId(null)}
                            className="absolute -top-1 -right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-500"
                        >
                            ×
                        </button>
                        <img
                            src={activeClue.image}
                            alt={`Indice ${activeClue.id}`}
                            className="max-w-[80vw] max-h-[70vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default MapPuzzle;


