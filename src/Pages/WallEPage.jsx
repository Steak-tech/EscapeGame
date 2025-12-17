import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../Context/GameContext.jsx';
import bgWallE from '../assets/Decor WallE.png';

// Configuration de la zone cliquable (rouge temporairement pour le placement)
const clickableZone = {
    position: { top: '70%', left: '53%' }, // À ajuster selon vos besoins
    size: { width: '360px', height: '200px' },
};

// Configuration des points d'étoiles pour la constellation
// Positions exactes selon le SVG de référence pour reproduire le contour du château
// Décalées vers le haut pour laisser de l'espace en bas pour les étoiles aléatoires
const starPoints = [
    // Base gauche
    { id: 1, x: 50, y: 200 },   // Coin bas gauche de la base (décalé de 30px vers le haut)
    { id: 2, x: 50, y: 170 },   // Coin haut gauche de la base (décalé de 30px vers le haut)
    // Connexion base-tour gauche
    { id: 3, x: 80, y: 170 },   // Connexion haut base-tour gauche (décalé de 30px vers le haut)
    // Tour gauche - contour
    { id: 4, x: 80, y: 120 },   // Début rectangle tour gauche (décalé de 30px vers le haut)
    { id: 5, x: 100, y: 90 },   // Sommet pointe tour gauche (décalé de 30px vers le haut)
    { id: 6, x: 120, y: 120 },  // Fin rectangle tour gauche (décalé de 30px vers le haut)
    { id: 7, x: 120, y: 200 },  // Bas tour gauche (décalé de 30px vers le haut)
    // Connexion vers tour centrale
    { id: 8, x: 170, y: 200 },  // Connexion bas vers tour centrale (décalé de 30px vers le haut)
    // Tour centrale - contour
    { id: 9, x: 170, y: 70 },   // Début rectangle tour centrale (décalé de 30px vers le haut)
    { id: 10, x: 200, y: 30 },  // Sommet pointe tour centrale (décalé de 30px vers le haut)
    { id: 11, x: 230, y: 70 },  // Fin rectangle tour centrale (décalé de 30px vers le haut)
    { id: 12, x: 230, y: 200 }, // Bas tour centrale (décalé de 30px vers le haut)
    // Connexion vers tour droite
    { id: 13, x: 280, y: 200 }, // Connexion bas vers tour droite (décalé de 30px vers le haut)
    // Tour droite - contour
    { id: 14, x: 280, y: 120 }, // Début rectangle tour droite (décalé de 30px vers le haut)
    { id: 15, x: 300, y: 90 },  // Sommet pointe tour droite (décalé de 30px vers le haut)
    { id: 16, x: 320, y: 120 }, // Fin rectangle tour droite (décalé de 30px vers le haut)
    { id: 17, x: 320, y: 170 }, // Bas tour droite (décalé de 30px vers le haut)
    // Base droite
    { id: 18, x: 350, y: 170 }, // Coin bas droit de la base (décalé de 30px vers le haut)
    { id: 19, x: 350, y: 200 }, // Coin haut droit de la base (décalé de 30px vers le haut)
];

// Génération de points aléatoires (leurres) avec espacement minimum
const generateRandomPoints = (count, excludeIds) => {
    const randomPoints = [];
    const minDistance = 25; // Distance minimale entre les points

    // Vérifier si un point est trop proche d'un autre
    const isTooClose = (x, y, existingPoints) => {
        for (const point of existingPoints) {
            const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
            if (distance < minDistance) {
                return true;
            }
        }
        // Vérifier aussi avec les points de la solution
        for (const star of starPoints) {
            const distance = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    };

    for (let i = 0; i < count; i++) {
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;

        // Générer un point avec espacement minimum
        // Permettre des points en bas (y > 200) pour créer une ligne d'étoiles aléatoires
        do {
            x = Math.random() * 350 + 25; // Entre 25 et 375
            // Générer plus de points en bas (y > 200) pour la ligne d'étoiles
            if (Math.random() < 0.3) {
                // 30% de chance d'être dans la zone basse (ligne d'étoiles)
                y = Math.random() * 30 + 200; // Entre 200 et 230
            } else {
                // 70% de chance d'être dans la zone normale
                y = Math.random() * 195 + 25; // Entre 25 et 220
            }
            attempts++;
        } while (isTooClose(x, y, randomPoints) && attempts < maxAttempts);

        if (attempts < maxAttempts) {
            randomPoints.push({
                id: `random_${i}`,
                x: Math.round(x),
                y: Math.round(y),
                isRandom: true
            });
        }
    }

    return randomPoints;
};

const randomPoints = generateRandomPoints(60, starPoints.map(s => s.id));

// Ordre de connexion attendu pour former le château de Disney
// Suit exactement le contour du SVG de référence
// Note: on vérifie seulement les 19 premiers points (sans le retour au point 1)
const expectedConnectionOrder = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
];

const WallEPage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [connectedPoints, setConnectedPoints] = useState([]);
    const [currentHover, setCurrentHover] = useState(null);
    const [showVictory, setShowVictory] = useState(false);
    const navigate = useNavigate();
    const { setGameFlag } = useGame();

    // Fonction pour obtenir l'ordre d'un point dans la séquence
    const getPointOrder = (starId) => {
        const index = expectedConnectionOrder.indexOf(starId);
        return index !== -1 ? index + 1 : null;
    };

    const handleZoneClick = () => {
        setShowPopup(true);
        setConnectedPoints([]);
    };

    const handleStarClick = (starId) => {
        // Ne pas permettre de cliquer deux fois sur le même point
        if (connectedPoints.includes(starId)) {
            return;
        }

        // Si c'est le premier clic, vérifier qu'on commence par le point 1 (seulement pour les points de la solution)
        if (connectedPoints.length === 0) {
            const isSolutionPoint = starPoints.some(p => p.id === starId);
            if (isSolutionPoint && starId === expectedConnectionOrder[0]) {
                setConnectedPoints([starId]);
            } else if (!isSolutionPoint) {
                // Si c'est un point aléatoire, on peut commencer par lui
                setConnectedPoints([starId]);
            }
            return;
        }

        // Après le premier point, on peut cliquer sur n'importe quel point (solution ou aléatoire)
        const newPoints = [...connectedPoints, starId];
        setConnectedPoints(newPoints);

        // Vérifier si on a cliqué tous les points de la solution (19 points)
        // Filtrer pour ne garder que les points de la solution dans l'ordre où ils ont été cliqués
        const solutionPoints = newPoints.filter(pointId =>
            starPoints.some(p => p.id === pointId)
        );

        console.log('Points de la solution cliqués:', solutionPoints);
        console.log('Nombre de points solution:', solutionPoints.length, 'sur', expectedConnectionOrder.length);

        if (solutionPoints.length === expectedConnectionOrder.length) {
            // Vérifier si l'ordre des points de la solution est correct (1 à 19)
            console.log('Tous les points solution sont cliqués, vérification...');
            setTimeout(() => {
                checkConstellation(solutionPoints);
            }, 300);
        }
    };

    const checkConstellation = (points) => {
        console.log('=== VÉRIFICATION CONSTELLATION ===');
        console.log('Points cliqués (solution uniquement):', points);
        console.log('Ordre attendu:', expectedConnectionOrder);
        console.log('Longueur points:', points.length, 'Longueur attendu:', expectedConnectionOrder.length);

        // Vérifier si l'ordre correspond exactement
        if (points.length !== expectedConnectionOrder.length) {
            console.log('❌ Nombre de points incorrect');
            setTimeout(() => {
                setConnectedPoints([]);
            }, 1000);
            return;
        }

        const matches = points.every((point, index) => {
            const match = point === expectedConnectionOrder[index];
            if (!match) {
                console.log(`❌ Point ${index + 1}: attendu ${expectedConnectionOrder[index]}, obtenu ${point}`);
            }
            return match;
        });

        console.log('Résultat final:', matches);

        if (matches) {
            // Constellation correcte !
            console.log('✅ VICTOIRE !');
            setShowVictory(true);
            setGameFlag('zone_walle_done', true);
            setTimeout(() => {
                setShowVictory(false);
                setShowPopup(false);
                navigate('/map');
            }, 3000);
        } else {
            // Réinitialiser
            console.log('❌ Échec, réinitialisation');
            setTimeout(() => {
                setConnectedPoints([]);
            }, 1000);
        }
    };

    const handleReset = () => {
        setConnectedPoints([]);
        setCurrentHover(null);
    };

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-black text-amber-50"
            style={{ userSelect: 'none' }}
        >
            {/* Image de fond Wall-E */}
            <img
                src={bgWallE}
                alt="Wall-E Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Voile sombre pour lisibilité */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Zone cliquable (transparente) */}
            <button
                type="button"
                onClick={handleZoneClick}
                className="absolute focus:outline-none focus-visible:outline-none bg-transparent border-none"
                style={{
                    top: clickableZone.position.top,
                    left: clickableZone.position.left,
                    transform: 'translate(-50%, -50%)',
                    width: clickableZone.size.width,
                    height: clickableZone.size.height,
                    cursor: 'pointer',
                }}
            >
                {/* Zone cliquable transparente */}
            </button>

            {/* Popup de la constellation */}
            {showPopup && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-slate-900/95 border-2 border-cyan-400/70 rounded-xl shadow-2xl overflow-hidden">
                        {/* Bouton de fermeture */}
                        <button
                            type="button"
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 z-40 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white text-lg font-bold shadow-md hover:bg-red-500 transition-colors"
                        >
                            ×
                        </button>

                        {/* Message système en haut */}
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 w-11/12 max-w-4xl">
                            <div className="bg-black/80 border border-cyan-400/50 rounded-lg px-6 py-4 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                <p className="text-cyan-300 font-mono text-sm md:text-base tracking-wider text-center">
                                    <span className="text-red-400 animate-pulse">SYSTEM ALERT:</span>{' '}
                                    Mémoire corrompue. Image de référence trouvée. Veuillez reconstruire la constellation magique.
                                </p>
                            </div>
                        </div>

                        {/* Zone centrale : Champ d'étoiles */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl h-[600px]">
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 400 250"
                                style={{ touchAction: 'none' }}
                            >
                                {/* Lignes connectées */}
                                {connectedPoints.length > 1 && connectedPoints.map((pointId, index) => {
                                    if (index === 0) return null;
                                    // Chercher dans les points de la solution
                                    let prevPoint = starPoints.find(p => p.id === connectedPoints[index - 1]);
                                    let currentPoint = starPoints.find(p => p.id === pointId);

                                    // Si pas trouvé dans la solution, chercher dans les points aléatoires
                                    if (!prevPoint) {
                                        prevPoint = randomPoints.find(p => p.id === connectedPoints[index - 1]);
                                    }
                                    if (!currentPoint) {
                                        currentPoint = randomPoints.find(p => p.id === pointId);
                                    }

                                    if (!prevPoint || !currentPoint) return null;

                                    return (
                                        <line
                                            key={`line-${index}`}
                                            x1={prevPoint.x}
                                            y1={prevPoint.y}
                                            x2={currentPoint.x}
                                            y2={currentPoint.y}
                                            stroke="#60a5fa"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    );
                                })}

                                {/* Points aléatoires (leurres) - cliquables */}
                                {randomPoints.map((star) => {
                                    const isConnected = connectedPoints.includes(star.id);
                                    const isLast = connectedPoints[connectedPoints.length - 1] === star.id;

                                    return (
                                        <g key={star.id}>
                                            {/* Point visible - pas d'indication visuelle */}
                                            <circle
                                                cx={star.x}
                                                cy={star.y}
                                                r={isLast ? "4" : isConnected ? "3.5" : "3"}
                                                fill={isConnected ? "#60a5fa" : "#6b7280"}
                                                opacity={isConnected ? 0.9 : 0.6}
                                                stroke={isLast ? "#3b82f6" : "none"}
                                                strokeWidth={isLast ? "1.5" : "0"}
                                                className="cursor-pointer"
                                                onClick={() => handleStarClick(star.id)}
                                            />
                                            {/* Zone cliquable invisible agrandie */}
                                            <circle
                                                cx={star.x}
                                                cy={star.y}
                                                r="25"
                                                fill="transparent"
                                                className="cursor-pointer"
                                                onClick={() => handleStarClick(star.id)}
                                            />
                                        </g>
                                    );
                                })}

                                {/* Points d'étoiles de la solution */}
                                {starPoints.map((star) => {
                                    const isConnected = connectedPoints.includes(star.id);
                                    const isLast = connectedPoints[connectedPoints.length - 1] === star.id;

                                    return (
                                        <g key={star.id}>
                                            {/* Point visible - pas d'indication visuelle pour les points non cliqués */}
                                            <circle
                                                cx={star.x}
                                                cy={star.y}
                                                r={isLast ? "5" : isConnected ? "4" : "3.5"}
                                                fill={isConnected ? "#60a5fa" : "#9ca3af"}
                                                stroke={isLast ? "#3b82f6" : "none"}
                                                strokeWidth={isLast ? "1.5" : "0"}
                                                opacity={isConnected ? 0.9 : 0.5}
                                                className="cursor-pointer"
                                                onClick={() => handleStarClick(star.id)}
                                            />
                                            {/* Zone cliquable invisible agrandie centrée exactement sur le point */}
                                            <circle
                                                cx={star.x}
                                                cy={star.y}
                                                r="25"
                                                fill="transparent"
                                                className="cursor-pointer"
                                                onClick={() => handleStarClick(star.id)}
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Cadre lumineux en bas à gauche avec l'image de référence */}
                        <div className="absolute bottom-6 left-6 z-20 w-40 h-32 bg-black/90 border-2 border-cyan-400/70 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.6)] p-1.5 flex flex-col">
                            <div className="text-[9px] text-cyan-300 font-mono mb-0.5 text-center flex-shrink-0">
                                [AIDE] Modèle de référence
                            </div>
                            <div className="flex-1 bg-slate-800 rounded border border-cyan-500/50 flex items-center justify-center overflow-hidden min-h-0">
                                {/* Image de référence du château de Disney */}
                                <svg
                                    viewBox="0 0 400 250"
                                    className="w-full h-full max-w-full max-h-full"
                                    preserveAspectRatio="xMidYMid meet"
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                >
                                    {/* Fond */}
                                    <rect width="400" height="250" fill="#1e293b" />

                                    {/* Château de Disney - Silhouette iconique */}
                                    {/* Base */}
                                    <rect x="50" y="200" width="300" height="30" fill="#3b82f6" opacity="0.8" />

                                    {/* Tour gauche */}
                                    <rect x="80" y="150" width="40" height="80" fill="#60a5fa" />
                                    <polygon points="80,150 100,120 120,150" fill="#3b82f6" />

                                    {/* Tour centrale (plus haute) */}
                                    <rect x="170" y="100" width="60" height="130" fill="#60a5fa" />
                                    <polygon points="170,100 200,60 230,100" fill="#3b82f6" />

                                    {/* Tour droite */}
                                    <rect x="280" y="150" width="40" height="80" fill="#60a5fa" />
                                    <polygon points="280,150 300,120 320,150" fill="#3b82f6" />

                                    {/* Arc central */}
                                    <path d="M 180 140 Q 200 120 220 140" stroke="#3b82f6" strokeWidth="3" fill="none" />

                                    {/* Détails */}
                                    <circle cx="200" cy="180" r="8" fill="#93c5fd" />
                                    <rect x="90" y="170" width="20" height="30" fill="#1e40af" opacity="0.6" />
                                    <rect x="290" y="170" width="20" height="30" fill="#1e40af" opacity="0.6" />
                                </svg>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center">
                            <p className="text-cyan-300/80 font-mono text-xs">
                                Reconstruisez la constellation en suivant le modèle de référence
                            </p>
                        </div>

                        {/* Bouton Reset */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="absolute bottom-6 right-6 z-20 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-300 rounded-lg text-sm font-mono transition-colors"
                        >
                            RESET
                        </button>

                        {/* Message de victoire */}
                        {showVictory && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400 rounded-xl p-8 shadow-2xl text-center animate-pulse">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h2 className="text-3xl font-bold text-cyan-300 mb-2 font-mono">
                                        CONSTELLATION RECONSTRUITE
                                    </h2>
                                    <p className="text-xl text-cyan-200 font-mono">
                                        Mémoire restaurée avec succès !
                                    </p>
                                    <p className="text-sm text-cyan-300/70 mt-4 font-mono">
                                        Redirection en cours...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WallEPage;

