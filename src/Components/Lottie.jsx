import React, { useState, useMemo } from 'react';

// --- 1. DONNÉES (10 Points uniques formant la boucle) ---
// L'ordre dans le tableau définit les voisins (0 est voisin de 1 et 9)
const POINTS_COEUR = [
    { id: 0, x: 175, y: 280 },
    { id: 1, x: 105, y: 220 },
    { id: 2, x: 55,  y: 150 },
    { id: 3, x: 55,  y: 90 },
    { id: 4, x: 115, y: 60 },
    { id: 5, x: 175, y: 110 }, // Creux
    { id: 6, x: 235, y: 60 },
    { id: 7, x: 295, y: 90 },
    { id: 8, x: 295, y: 150 },
    { id: 9, x: 245, y: 220 },
];

const CANVAS_SIZE = 800;
const NB_FAKE_STARS = 150;

// --- 2. ICONE ÉTOILE ---
const StarIcon = ({ size = 20, className, fill = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className={className} style={{ transform: 'translate(-50%, -50%)' }}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

// --- 3. COMPOSANT PRINCIPAL ---
const ConstellationPuzzle = ({ onPuzzleSolved }) => {
    // visitedIndices stocke l'historique des index cliqués (ex: [0, 9, 8...])
    const [visitedIndices, setVisitedIndices] = useState([]);
    const [lines, setLines] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [errorId, setErrorId] = useState(null);

    // --- GÉNÉRATION DES FAUSSES ÉTOILES ---
    const fakeStars = useMemo(() => {
        const stars = [];
        let attempts = 0;
        while (stars.length < NB_FAKE_STARS && attempts < 1000) {
            const x = Math.random() * (CANVAS_SIZE - 20) + 10;
            const y = Math.random() * (CANVAS_SIZE - 20) + 10;

            const tooClose = POINTS_COEUR.some(p => {
                const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
                return dist < 30; // Distance de sécurité (étoiles grosses)
            });

            if (!tooClose) {
                stars.push({
                    id: `fake-${stars.length}`,
                    x, y,
                    size: Math.random() * 12 + 12,
                    opacity: Math.random() * 0.4 + 0.4
                });
            }
            attempts++;
        }
        return stars;
    }, []);

    // --- GESTION ERREUR (Juste visuelle) ---
    const triggerError = (id) => {
        setErrorId(id);
        setTimeout(() => setErrorId(null), 500);
    };

    // --- LOGIQUE CŒUR (Complexe) ---
    const handleRealPointClick = (point, index) => {
        if (isFinished) return;

        // 1. PREMIER CLIC : On commence n'importe où
        if (visitedIndices.length === 0) {
            setVisitedIndices([index]);
            return;
        }

        const lastIndex = visitedIndices[visitedIndices.length - 1];
        const firstIndex = visitedIndices[0];

        // 2. CAS DE FERMETURE (On a cliqué sur tous les points uniques et on revient au départ)
        if (visitedIndices.length === POINTS_COEUR.length) {
            if (index === firstIndex) {
                // VICTOIRE : On boucle la boucle
                const prevPoint = POINTS_COEUR[lastIndex];
                setLines(prev => [...prev, { x1: prevPoint.x, y1: prevPoint.y, x2: point.x, y2: point.y }]);
                setIsFinished(true);
                if (onPuzzleSolved) onPuzzleSolved();
            } else {
                // On a tout visité mais on clique sur autre chose que le point de départ
                triggerError(point.id);
            }
            return;
        }

        // 3. CAS DÉJÀ VISITÉ (Interdit, sauf si c'est la fermeture gérée au dessus)
        if (visitedIndices.includes(index)) {
            triggerError(point.id);
            return;
        }

        // 4. VALIDATION DU VOISIN
        // On doit vérifier si le point cliqué est adjacent au précédent
        const total = POINTS_COEUR.length;

        // Calcul des voisins possibles (modulo pour gérer la boucle 0 <-> 9)
        const neighborClockwise = (lastIndex + 1) % total;
        const neighborCounterClock = (lastIndex - 1 + total) % total;

        let isValid = false;

        // Si c'est le 2ème point, on DÉFINIT la direction
        if (visitedIndices.length === 1) {
            if (index === neighborClockwise || index === neighborCounterClock) {
                isValid = true;
            }
        }
        // Si on a déjà commencé une ligne (> 2 points), on impose la direction
        else {
            // On déduit la direction prise entre le point 0 et 1
            const secondIndex = visitedIndices[1];
            // Est-ce qu'on tourne en sens horaire ?
            const isClockwise = secondIndex === (firstIndex + 1) % total;

            const expectedNext = isClockwise ? neighborClockwise : neighborCounterClock;

            if (index === expectedNext) {
                isValid = true;
            }
        }

        if (isValid) {
            // AJOUT DE LA LIGNE
            const prevPoint = POINTS_COEUR[lastIndex];
            setLines(prev => [...prev, { x1: prevPoint.x, y1: prevPoint.y, x2: point.x, y2: point.y }]);
            setVisitedIndices(prev => [...prev, index]);
        } else {
            triggerError(point.id);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 select-none">

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) translateX(0); }
          25% { transform: translate(-50%, -50%) translateX(-5px); }
          75% { transform: translate(-50%, -50%) translateX(5px); }
        }
        .animate-shake-custom { animation: shake 0.4s ease-in-out; color: #ef4444 !important; opacity: 1 !important; }
      `}</style>

            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900"
                 style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>

                {/* FOND */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0f172a] to-black"></div>

                {/* --- FAUSSES ÉTOILES --- */}
                {fakeStars.map((star) => (
                    <div
                        key={star.id}
                        onClick={() => triggerError(star.id)} // Erreur simple, pas de reset
                        className={`absolute cursor-pointer p-2 z-10 transition-colors duration-200
              ${errorId === star.id ? 'animate-shake-custom text-red-500' : 'text-slate-500 hover:text-slate-300'}
            `}
                        style={{
                            left: star.x, top: star.y,
                            transform: 'translate(-50%, -50%)',
                            opacity: errorId === star.id ? 1 : star.opacity
                        }}
                    >
                        <StarIcon size={star.size} />
                    </div>
                ))}

                {/* TRACÉ */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {lines.map((line, i) => (
                        <line
                            key={i}
                            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            className="text-cyan-200 drop-shadow-[0_0_8px_rgba(103,232,249,0.6)] transition-all duration-500"
                        />
                    ))}
                </svg>

                {/* --- VRAIES ÉTOILES --- */}
                {POINTS_COEUR.map((point, index) => {
                    // Est-ce que ce point fait partie du tracé actuel ?
                    const isVisited = visitedIndices.includes(index);
                    // Est-ce le tout dernier point validé ?
                    const isLastActive = visitedIndices.length > 0 && visitedIndices[visitedIndices.length - 1] === index;
                    // Est-ce le point de départ (qui doit briller à la fin pour fermer la boucle)
                    const isStartPoint = visitedIndices.length > 0 && visitedIndices[0] === index;
                    const canCloseLoop = visitedIndices.length === POINTS_COEUR.length;

                    const isError = errorId === point.id;

                    return (
                        <div
                            key={point.id}
                            onClick={() => handleRealPointClick(point, index)}
                            className={`absolute cursor-pointer z-20 p-2 ${isError ? 'animate-shake-custom' : ''}`}
                            style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%)' }}
                        >
                            <StarIcon
                                // Taille : Normale, sauf si fini.
                                size={isFinished ? 24 : 20}
                                className={`transition-all duration-300
                  ${isVisited ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}
                  
                  ${/* Si on peut fermer la boucle, on fait pulser le point de départ */ ''}
                  ${canCloseLoop && isStartPoint && !isFinished ? 'text-cyan-300 animate-pulse scale-125 drop-shadow-[0_0_10px_rgba(34,211,238,1)]' : ''}

                  ${isFinished ? 'text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]' : ''}
                  ${isError ? 'text-red-500' : ''}
                `}
                            />
                        </div>
                    );
                })}

                {/* --- MESSAGE VICTOIRE --- */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-700 pointer-events-none ${isFinished ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-center animate-bounce">
                        <div className="text-pink-400 text-5xl mb-4 drop-shadow-[0_0_20px_rgba(236,72,153,1)]">❤</div>
                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400 font-bold text-2xl uppercase tracking-widest">
                            Constellation Activée
                        </h3>
                    </div>
                </div>

            </div>
            <p className="mt-4 text-slate-500 text-xs uppercase tracking-widest">
                Trouvez le motif caché
            </p>
        </div>
    );
};

export default ConstellationPuzzle;