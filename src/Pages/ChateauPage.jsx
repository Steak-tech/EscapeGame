import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../Context/GameContext.jsx';
import { gsap } from 'gsap';
import bgChateau from '../assets/chateau.png';
// Personnages de chaque zone
import Gemini1 from '../assets/Gemini1.png';
import scatCat1 from '../assets/Scat Cat 1.png';
import Zazu1 from '../assets/Zazu1.png';
import Walle1 from '../assets/Walle1.png';
import BulleZazu from '../assets/BulleZazu.png';
// Vidéo de fin
import finVideo from '../assets/fin.mp4';

// Images de Walt Disney
import Walt1 from '../assets/walt1.png';
import Walt2 from '../assets/walt2.png';
import Walt3 from '../assets/walt3.png';
import Walt4 from '../assets/walt4.png';
import Walt5 from '../assets/walt5.png';

// Système de dialogue dédié à la page Château (avec effet machine à écrire)
const ChateauDialogue = ({ script, onComplete, backgroundColor = 'amber' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const currentLine = script[currentIndex];

    // Fonction utilitaire : retour à la ligne automatique après un certain nombre de caractères
    const wrapText = (text, maxCharsPerLine = 55) => {
        if (!text) return "";
        const words = text.split(" ");
        const lines = [];
        let currentLineText = "";

        words.forEach((word) => {
            const tentative = currentLineText ? `${currentLineText} ${word}` : word;
            if (tentative.length > maxCharsPerLine) {
                if (currentLineText) lines.push(currentLineText);
                currentLineText = word;
            } else {
                currentLineText = tentative;
            }
        });

        if (currentLineText) lines.push(currentLineText);
        return lines.join("\n");
    };

    const fullText = currentLine ? wrapText(currentLine.text) : "";

    // Effet machine à écrire
    useEffect(() => {
        if (!currentLine) return;

        setDisplayedText("");
        setIsTyping(true);

        let charIndex = 0;
        const typingInterval = setInterval(() => {
            if (charIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, charIndex));
                charIndex++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);
            }
        }, 30);

        return () => clearInterval(typingInterval);
    }, [currentIndex, currentLine, fullText]);

    const handleNext = () => {
        // Si on clique pendant que ça tape, on affiche directement tout le texte
        if (isTyping && currentLine) {
            if (displayedText !== fullText) {
                setDisplayedText(fullText);
            }
            setIsTyping(false);
            return;
        }

        // Sinon, on passe à la ligne suivante
        if (currentIndex < script.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else if (onComplete) {
            onComplete();
        }
    };

    if (!currentLine) return null;

    // Déterminer la couleur de fond selon la prop
    const bgColorClass = backgroundColor === 'blue'
        ? 'via-black/90 to-transparent from-cyan-400 bg-gradient-to-t'
        : 'via-black/90 to-transparent from-amber-900 bg-gradient-to-t';

    return (
        <div
            onClick={handleNext}
            className={`fixed bottom-0 left-0 w-full px-4 pb-4 pt-2 z-50 cursor-pointer ${bgColorClass}`}
        >
            <div className="max-w-5xl mx-auto flex w-full items-end gap-6">
                {/* AVATAR À GAUCHE (taille fixe) */}
                <div
                    className="relative flex-none transform translate-y-15 -translate-x-10"
                    style={{ width: '400px', height: '430px' }}
                >
                    <img
                        src={currentLine.image}
                        alt={currentLine.character}
                        className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
                    />
                </div>

                {/* BULLE DE DIALOGUE (position personnalisée) */}
                <div className="relative flex-none mb-12 flex justify-start transform -translate-y-0 -translate-x-130">
                    {/* Image de la bulle */}
                    <img
                        src={BulleZazu}
                        alt="Bulle de dialogue"
                        style={{ width: '1300px', maxWidth: '100%', height: 'auto' }}
                        className="object-contain"
                    />

                    {/* Contenu texte dans la bulle (positionné à l'intérieur du parchemin) */}
                    <div className="absolute top-[10%] bottom-[18%] left-[35%] right-[14%] flex flex-col justify-center py-2">
                        <span className="shrink-0 block text-2xl md:text-3xl font-bold text-amber-900 drop-shadow-md mb-2">
                            {currentLine.character}
                        </span>
                        <p className="text-black text-sm md:text-base leading-relaxed font-sans drop-shadow-sm overflow-y-auto whitespace-pre-line">
                            {displayedText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Scénario de dialogue pour la page Château
const SCENARIO_CHATEAU = [
    {
        id: 1,
        character: "Gemini",
        image: Gemini1,
        text: "Nous avons tous répondu à l'appel... Chacun de nous a retrouvé un fragment de la magie perdue.",
        side: "left",
    },
    {
        id: 2,
        character: "Scat Cat",
        image: scatCat1,
        text: "Les mélodies oubliées, les histoires effacées... Tout ce qui brillait autrefois est maintenant rassemblé ici.",
        side: "left",
    },
    {
        id: 3,
        character: "Zazu",
        image: Zazu1,
        text: "Le château de Disney... Le cœur même de cette magie. Il attend que tu le réveilles une dernière fois.",
        side: "left",
    },
    {
        id: 4,
        character: "WALL·E",
        image: Walle1,
        text: "Bip... bip... La constellation est reconstruite, les mémoires sont restaurées. Il ne reste plus qu'une dernière étincelle à rallumer.",
        side: "left",
    },
];

// Scénario de dialogue pour Walt Disney (suite du dialogue)
const SCENARIO_WALT = [
    {
        id: 1,
        character: "Walt Disney",
        image: Walt1,
        text: "Ça y est tu as réussi, tu as accompli ta mission. Les énigmes ont été résolues, les secrets ont été révélés.",
        side: "left",
    },
    {
        id: 2,
        character: "Walt Disney",
        image: Walt2,
        text: "Le grimoire a été retrouvé et ses pages brillent à nouveau. La magie coule entre tes mains jeune joueur.",
        side: "left",
    },
    {
        id: 3,
        character: "Walt Disney",
        image: Walt3,
        text: "Grâce à toi, Disney renaît de ses cendres, les royaumes s’illuminent et les personnages reviennent à la vie.",
        side: "left",
    },
    {
        id: 4,
        character: "Walt Disney",
        image: Walt4,
        text: "La flamme dans le coeur des enfants et des parents à été rallumée. Leurs rêve reprennent vie et les histoires continues.",
        side: "left",
    },
    {
        id: 5,
        character: "Walt Disney",
        image: Walt5,
        text: "Et tant que ce grimoire existera …. La magie ne disparaîtra jamais !!",
        side: "left",
    },
];

const ChateauPage = () => {
    const navigate = useNavigate();
    const { checkFlag, setGameFlag } = useGame();
    const [showFirstDialogue, setShowFirstDialogue] = useState(true);
    const [showSecondDialogue, setShowSecondDialogue] = useState(false);
    const [showBookPopup, setShowBookPopup] = useState(false);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [textInputs, setTextInputs] = useState(['', '', '', '', '', '', '']); // 7 trous à remplir
    const [showFadeOut, setShowFadeOut] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef(null);
    const showDialogue = showFirstDialogue || showSecondDialogue;

    // Texte à trous - Le Grimoire de Walt Disney
    const puzzleText = {
        before: "Vous qui avez voyagé à travers mes rêves, Pour ouvrir le livre de tous les secrets, rassemblez vos souvenirs.\n\nTout a commencé dans le froid de ",
        gap1: "",
        middle1: ". J'ai dû surmonter la perte d' ",
        gap2: "",
        middle2: " et retrouver la trace d' ",
        gap3: "",
        middle3: ".\nJ'ai appris qu'un cœur de bois devient ",
        gap4: "",
        middle4: " par le courage. J'ai compris que la musique peut briser n'importe quelle ",
        gap5: "",
        middle5: ". Et j'ai accepté que nous sommes tous liés dans le grand cycle des ",
        gap6: "",
        middle6: ". Et que l'amour de wall e pour ",
        gap7: "",
        after: " peut dépasser toutes les étoiles.\n\nSi vous possédez ces six vérités, le Grimoire est à vous.",
    };

    // Réponses attendues
    const expectedAnswers = ['1901', 'oswald', 'alice', 'vivant', 'cage', 'lion', 'eve'];

    const handleFirstDialogueEnd = () => {
        setShowFirstDialogue(false);
    };

    const fadeOutRef = useRef(null);

    // Effet pour masquer/réafficher l'icône de carte
    useEffect(() => {
        // Sélectionner l'icône de carte (elle a la classe absolute top-2 left-4)
        const mapIcon = document.querySelector('img[alt="Open map"]');

        if (showFadeOut || showVideo) {
            // Masquer la carte pendant le fondu et la vidéo
            if (mapIcon) {
                mapIcon.style.display = 'none';
            }
        } else {
            // Réafficher la carte quand la vidéo est terminée
            if (mapIcon) {
                mapIcon.style.display = '';
            }
        }

        return () => {
            // Nettoyage : réafficher la carte si le composant est démonté
            if (mapIcon) {
                mapIcon.style.display = '';
            }
        };
    }, [showFadeOut, showVideo]);

    // Gestion de la fin de la vidéo
    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        const handleVideoEnd = () => {
            setShowVideo(false);
            setShowFadeOut(false);
        };

        video.addEventListener('ended', handleVideoEnd);

        return () => {
            video.removeEventListener('ended', handleVideoEnd);
        };
    }, [showVideo]);

    const handleSecondDialogueEnd = () => {
        setShowSecondDialogue(false);
        // Après 2 secondes, déclencher le fondu noir puis la vidéo
        setTimeout(() => {
            setShowFadeOut(true);
            // Animation du fondu avec GSAP
            if (fadeOutRef.current) {
                gsap.fromTo(fadeOutRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 1, ease: "power2.in" }
                );
            }
            // Après le fondu, lancer la vidéo
            setTimeout(() => {
                setShowVideo(true);
                if (videoRef.current) {
                    videoRef.current.play().catch(err => {
                        console.error("Erreur lors de la lecture de la vidéo:", err);
                    });
                }
            }, 1000); // 1 seconde pour le fondu
        }, 2000); // 2 secondes après la fin du dialogue
    };

    const handleBookPopupClose = () => {
        setShowBookPopup(false);
    };

    const handleTextInputChange = (index, value) => {
        const newInputs = [...textInputs];
        newInputs[index] = value.toLowerCase().trim();
        setTextInputs(newInputs);
    };

    const handlePuzzleSubmit = () => {
        // Vérifier si toutes les réponses sont correctes
        const allCorrect = textInputs.every((input, index) =>
            input === expectedAnswers[index]
        );

        if (allCorrect) {
            setPuzzleSolved(true);
            setGameFlag('zone_chateau_done', true);
            setShowBookPopup(false);
            // Afficher le dialogue de Walt après validation
            setShowSecondDialogue(true);
        } else {
            // Réinitialiser les inputs en cas d'erreur
            setTextInputs(['', '', '', '', '', '', '']);
            alert('Ce n\'est pas la bonne réponse. Réessayez !');
        }
    };

    // Refs pour les animations GSAP
    const lightZonesRef = useRef([]);
    const charactersRef = useRef([]);
    const fireworksContainerRef = useRef(null);

    // Configuration des personnages avec leurs positions
    const characters = [
        { id: 'pinocchio', image: Gemini1, position: { top: '20%', left: '20%' }, size: { width: '120px', height: 'auto' } },
        { id: 'aristochats', image: scatCat1, position: { top: '20%', left: '80%' }, size: { width: '150px', height: 'auto' } },
        { id: 'lion', image: Zazu1, position: { top: '70%', left: '20%' }, size: { width: '150px', height: 'auto' } },
        { id: 'walle', image: Walle1, position: { top: '70%', left: '80%' }, size: { width: '150px', height: 'auto' } },
    ];

    // Configuration des zones lumineuses
    const lightZones = [
        { id: 1, position: { top: '25%', left: '20%' }, size: { width: '200px', height: '200px' } },
        { id: 2, position: { top: '25%', left: '80%' }, size: { width: '200px', height: '200px' } },
        { id: 3, position: { top: '75%', left: '20%' }, size: { width: '200px', height: '200px' } },
        { id: 4, position: { top: '75%', left: '80%' }, size: { width: '200px', height: '200px' } },
        { id: 5, position: { top: '60%', left: '50%' }, size: { width: '300px', height: '300px' } }, // Zone centrale
    ];

    // Palettes de couleurs pour les feux d'artifice
    const colorPalettes = {
        red: ['rgba(239, 68, 68, 1)', 'rgba(220, 38, 38, 1)', 'rgba(185, 28, 28, 1)', 'rgba(248, 113, 113, 1)'],
        green: ['rgba(34, 197, 94, 1)', 'rgba(22, 163, 74, 1)', 'rgba(16, 185, 129, 1)', 'rgba(74, 222, 128, 1)'],
        pink: ['rgba(244, 114, 182, 1)', 'rgba(236, 72, 153, 1)', 'rgba(219, 39, 119, 1)', 'rgba(249, 168, 212, 1)'],
        multicolor: [
            'rgba(251, 191, 36, 1)', // Amber
            'rgba(34, 211, 238, 1)', // Cyan
            'rgba(244, 114, 182, 1)', // Pink
            'rgba(20, 184, 166, 1)', // Teal
            'rgba(250, 204, 21, 1)', // Yellow
            'rgba(139, 92, 246, 1)', // Purple
            'rgba(239, 68, 68, 1)', // Red
            'rgba(34, 197, 94, 1)', // Green
        ],
    };

    // Fonction pour générer des positions de forme spéciale
    const getShapePositions = (shapeType, centerX, centerY, radius) => {
        const positions = [];

        switch (shapeType) {
            case 'heart':
                // Forme de cœur
                for (let i = 0; i < 50; i++) {
                    const t = (i / 50) * Math.PI * 2;
                    const x = 16 * Math.pow(Math.sin(t), 3);
                    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    positions.push({
                        x: centerX + x * radius * 0.05,
                        y: centerY + y * radius * 0.05,
                    });
                }
                break;

            case 'robot':
                // Forme de robot (carré avec tête)
                const robotParts = [
                    // Tête (carré)
                    { x: -1, y: -2 }, { x: 1, y: -2 }, { x: 1, y: 0 }, { x: -1, y: 0 },
                    // Corps (rectangle)
                    { x: -1.5, y: 0 }, { x: 1.5, y: 0 }, { x: 1.5, y: 2 }, { x: -1.5, y: 2 },
                    // Bras gauche
                    { x: -2, y: 0.5 }, { x: -2.5, y: 0.5 }, { x: -2.5, y: 1.5 }, { x: -2, y: 1.5 },
                    // Bras droit
                    { x: 2, y: 0.5 }, { x: 2.5, y: 0.5 }, { x: 2.5, y: 1.5 }, { x: 2, y: 1.5 },
                    // Jambes
                    { x: -0.8, y: 2 }, { x: -0.8, y: 3 }, { x: -0.3, y: 3 }, { x: -0.3, y: 2 },
                    { x: 0.3, y: 2 }, { x: 0.3, y: 3 }, { x: 0.8, y: 3 }, { x: 0.8, y: 2 },
                ];
                robotParts.forEach(part => {
                    positions.push({
                        x: centerX + part.x * radius * 0.1,
                        y: centerY + part.y * radius * 0.1,
                    });
                });
                // Remplir avec des particules supplémentaires
                for (let i = 0; i < 20; i++) {
                    positions.push({
                        x: centerX + (Math.random() - 0.5) * radius * 0.3,
                        y: centerY + (Math.random() - 0.5) * radius * 0.3,
                    });
                }
                break;

            case 'smiley':
                // Forme de bonhomme souriant
                // Cercle principal (visage)
                for (let i = 0; i < 30; i++) {
                    const angle = (i / 30) * Math.PI * 2;
                    positions.push({
                        x: centerX + Math.cos(angle) * radius * 0.15,
                        y: centerY + Math.sin(angle) * radius * 0.15,
                    });
                }
                // Yeux
                positions.push({ x: centerX - radius * 0.08, y: centerY - radius * 0.05 });
                positions.push({ x: centerX + radius * 0.08, y: centerY - radius * 0.05 });
                // Bouche (sourire)
                for (let i = 0; i < 10; i++) {
                    const angle = Math.PI + (i / 10) * Math.PI * 0.5;
                    positions.push({
                        x: centerX + Math.cos(angle) * radius * 0.1,
                        y: centerY + Math.sin(angle) * radius * 0.1 + radius * 0.05,
                    });
                }
                break;

            default: // 'circle' - explosion circulaire normale
                for (let i = 0; i < 30; i++) {
                    const angle = (i / 30) * Math.PI * 2;
                    positions.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius,
                    });
                }
                break;
        }

        return positions;
    };

    // Fonction pour créer une explosion de feu d'artifice avec forme spéciale
    const createFirework = (x, y, colorType = 'multicolor', shapeType = 'circle') => {
        if (!fireworksContainerRef.current) return;

        const colors = colorPalettes[colorType] || colorPalettes.multicolor;
        const radius = 150 + Math.random() * 100;

        // Obtenir les positions selon la forme
        const positions = getShapePositions(shapeType, x, y, radius);
        const particleCount = positions.length;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';

            // Couleur selon le type
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

            fireworksContainerRef.current.appendChild(particle);

            // Position finale selon la forme
            const targetPos = positions[i];
            const vx = targetPos.x - x;
            const vy = targetPos.y - y;
            const velocity = Math.sqrt(vx * vx + vy * vy) * (0.8 + Math.random() * 0.4);

            // Animation GSAP de l'explosion
            gsap.fromTo(
                particle,
                {
                    x: x,
                    y: y,
                    opacity: 1,
                    scale: 1,
                },
                {
                    x: targetPos.x,
                    y: targetPos.y,
                    opacity: 0,
                    scale: 0,
                    duration: 1.5 + Math.random() * 0.5,
                    ease: 'power2.out',
                    onComplete: () => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    },
                }
            );
        }
    };

    // Fonction pour lancer une fusée qui décolle puis explose
    const launchFireworkRocket = () => {
        if (!fireworksContainerRef.current) return;

        // Choisir aléatoirement un type de couleur et une forme
        const colorTypes = ['red', 'green', 'pink', 'multicolor'];
        const shapeTypes = ['circle', 'heart', 'robot', 'smiley'];

        const colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

        // Couleur de la fusée selon le type
        const rocketColors = {
            red: { top: 'rgba(239, 68, 68, 1)', bottom: 'rgba(185, 28, 28, 1)', glow: 'rgba(239, 68, 68, 0.9)' },
            green: { top: 'rgba(34, 197, 94, 1)', bottom: 'rgba(22, 163, 74, 1)', glow: 'rgba(34, 197, 94, 0.9)' },
            pink: { top: 'rgba(244, 114, 182, 1)', bottom: 'rgba(219, 39, 119, 1)', glow: 'rgba(244, 114, 182, 0.9)' },
            multicolor: { top: 'rgba(248, 250, 252, 1)', bottom: 'rgba(190, 242, 255, 1)', glow: 'rgba(59, 130, 246, 0.7)' },
        };

        const rocketColor = rocketColors[colorType] || rocketColors.multicolor;

        const rocket = document.createElement('div');
        rocket.style.position = 'absolute';
        rocket.style.width = '4px';
        rocket.style.height = '14px';
        rocket.style.borderRadius = '999px';
        rocket.style.pointerEvents = 'none';
        rocket.style.background = `linear-gradient(to top, ${rocketColor.top}, ${rocketColor.bottom})`;
        rocket.style.boxShadow = `0 0 12px ${rocketColor.glow}, 0 0 24px ${rocketColor.glow}`;

        fireworksContainerRef.current.appendChild(rocket);

        const viewportWidth = window.innerWidth || 1920;
        const viewportHeight = window.innerHeight || 1080;

        // Départ en bas de l'écran, position horizontale aléatoire
        const startX = viewportWidth * (0.1 + Math.random() * 0.8); // entre 10% et 90%
        const startY = viewportHeight * 0.95;

        // Hauteur d'explosion quelque part dans le haut / milieu de l'écran
        const explosionY = viewportHeight * (0.2 + Math.random() * 0.3); // entre 20% et 50%

        // Légère dérive horizontale pendant la montée
        const targetX = startX + (Math.random() - 0.5) * 80;

        // Traînée lumineuse pendant le décollage
        gsap.fromTo(
            rocket,
            {
                x: startX,
                y: startY,
                opacity: 1,
                scaleY: 1,
            },
            {
                x: targetX,
                y: explosionY,
                opacity: 1,
                scaleY: 0.7,
                duration: 0.8 + Math.random() * 0.4,
                ease: 'power2.out',
                onComplete: () => {
                    // Créer l'explosion au point d'arrivée avec la couleur et la forme choisies
                    createFirework(targetX, explosionY, colorType, shapeType);
                    if (rocket.parentNode) {
                        rocket.parentNode.removeChild(rocket);
                    }
                },
            }
        );
    };

    // Animation continue du feu d'artifice : plusieurs fusées qui décollent un peu partout
    // Seulement après que le dialogue de Walt soit terminé
    // On s'assure que tout est nettoyé (intervalle + tweens + particules) quand on quitte la page
    useEffect(() => {
        if (showDialogue || !puzzleSolved) return;

        // Lancer régulièrement des fusées avec différentes couleurs et formes
        const interval = setInterval(() => {
            // 1 à 3 fusées par salve pour remplir la page
            const rocketsThisWave = 1 + Math.floor(Math.random() * 3);
            for (let i = 0; i < rocketsThisWave; i++) {
                setTimeout(() => {
                    launchFireworkRocket();
                }, i * 200); // Délai entre chaque fusée
            }
        }, 900);

        return () => {
            // Stopper le timer pour ne plus créer de nouvelles fusées
            clearInterval(interval);

            // Arrêter toutes les animations sur les particules et nettoyer le conteneur
            if (fireworksContainerRef.current) {
                gsap.killTweensOf(fireworksContainerRef.current.querySelectorAll('*'));
                fireworksContainerRef.current.innerHTML = '';
            }
        };
    }, [showDialogue, puzzleSolved]);

    // Animation des zones lumineuses avec GSAP
    // On ne lance les animations qu'une fois le premier dialogue terminé
    useEffect(() => {
        if (showFirstDialogue) return;

        lightZonesRef.current.forEach((zone, index) => {
            if (!zone) return;

            // On nettoie d'éventuelles animations précédentes
            gsap.killTweensOf(zone);

            // Animation de pulsation
            gsap.to(zone, {
                scale: 1.2,
                opacity: 0.8,
                duration: 2 + index * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            // Animation de rotation lente
            gsap.to(zone, {
                rotation: 360,
                duration: 20 + index * 2,
                repeat: -1,
                ease: 'none',
            });

            // Animation de mouvement (déplacement circulaire)
            gsap.to(zone, {
                x: '+=10',
                y: '+=8',
                duration: 3 + index * 0.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.3,
            });
        });
    }, [showFirstDialogue]);


    // Animation d'apparition et de mouvement des personnages
    useEffect(() => {
        if (showFirstDialogue) return;

        charactersRef.current.forEach((char, index) => {
            if (!char) return;

            gsap.killTweensOf(char);

            // Animation d'apparition
            gsap.fromTo(
                char,
                {
                    opacity: 0,
                    scale: 0.5,
                    y: 50,
                    rotation: -15,
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotation: 0,
                    duration: 1,
                    delay: index * 0.2,
                    ease: 'back.out(1.7)',
                }
            );

            // Animation de flottement vertical
            gsap.to(char, {
                y: '+=15',
                duration: 2.5 + index * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1 + index * 0.2,
            });

            // Animation de mouvement horizontal (balancement)
            gsap.to(char, {
                x: '+=8',
                duration: 3 + index * 0.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1.5 + index * 0.2,
            });

            // Animation de rotation légère (balancement)
            gsap.to(char, {
                rotation: 5,
                duration: 2 + index * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 2 + index * 0.2,
            });

            // Animation de pulsation (scale)
            gsap.to(char, {
                scale: 1.05,
                duration: 2 + index * 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 2.5 + index * 0.2,
            });
        });
    }, [showFirstDialogue]);

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-black text-amber-50"
            style={{ userSelect: 'none' }}
        >
            {/* Image de fond du château */}
            <img
                src={bgChateau}
                alt="Château de Disney"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Voile sombre pour lisibilité */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Contenu principal */}
            <div className="relative z-10 w-full h-full">
                {/* Premier dialogue : les personnages (fond orange/amber) */}
                {showFirstDialogue && (
                    <ChateauDialogue
                        script={SCENARIO_CHATEAU}
                        onComplete={handleFirstDialogueEnd}
                        backgroundColor="amber"
                    />
                )}

                {/* Deuxième dialogue : Walt Disney (fond bleu) - seulement après validation de l'énigme */}
                {showSecondDialogue && puzzleSolved && (
                    <ChateauDialogue
                        script={SCENARIO_WALT}
                        onComplete={handleSecondDialogueEnd}
                        backgroundColor="blue"
                    />
                )}

                {/* Popup du livre ancien avec texte à trous */}
                {showBookPopup && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="relative w-full max-w-4xl max-h-[90vh] mx-4">
                            {/* Livre ancien */}
                            <div className="relative rounded-lg shadow-2xl p-8 md:p-12">
                                {/* Texture de papier vieilli */}
                                <div className="absolute inset-0 rounded-lg opacity-20 bg-[radial-gradient(circle_at_30%_40%,rgba(139,69,19,0.3)_0%,transparent_50%)]" />

                                {/* Bouton de fermeture */}
                                <button
                                    type="button"
                                    onClick={handleBookPopupClose}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white text-lg font-bold shadow-md hover:bg-red-500 transition-colors z-10"
                                >
                                    ×
                                </button>

                                {/* Contenu du livre */}
                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-6 text-center drop-shadow-lg">
                                        Le Grimoire de Walt Disney
                                    </h2>

                                    {/* Texte à trous – design livre ancien */}
                                    <div className="relative bg-gradient-to-br from-amber-50 via-amber-100/90 to-amber-50 rounded-2xl p-8 md:p-10 mb-6 border-4 border-white/30 shadow-2xl max-h-[65vh] overflow-y-auto">
                                        {/* Effet de parchemin vieilli */}
                                        <div className="absolute inset-0 rounded-2xl opacity-30 bg-[radial-gradient(circle_at_20%_30%,rgba(139,69,19,0.2)_0%,transparent_80%),radial-gradient(circle_at_80%_70%,rgba(101,67,33,0.15)_0%,transparent_80%)]" />

                                        {/* Lignes de texte (comme un vrai livre) */}
                                        <div className="absolute left-8 right-8 top-8 bottom-8 border-l-2 border-white/20" />
                                        <div className="absolute left-8 right-8 top-8 bottom-8 border-r-2 border-white/20" />

                                        {/* Contenu */}
                                        <div className="relative z-10">
                                            <div className="space-y-4 text-amber-900 text-base md:text-lg leading-relaxed font-serif">
                                                <p className="whitespace-pre-line text-center">
                                                    {"Vous qui avez voyagé à travers mes rêves, pour ouvrir le livre de tous les secrets, "}
                                                    {"rassemblez vos souvenirs."}
                                                </p>

                                                <p className="mt-4">
                                                    {"Tout a commencé dans le froid de "}
                                                    <input
                                                        type="text"
                                                        value={textInputs[0]}
                                                        onChange={(e) => handleTextInputChange(0, e.target.value)}
                                                        className="inline-block w-28 md:w-36 mx-1 px-3 py-1 bg-amber-200/50 rounded-md text-amber-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-200/80 transition-all"
                                                        placeholder="..."
                                                    />
                                                    {"."}
                                                </p>

                                                <p>
                                                    {"J'ai dû surmonter la perte d' "}
                                                    <input
                                                        type="text"
                                                        value={textInputs[1]}
                                                        onChange={(e) => handleTextInputChange(1, e.target.value)}
                                                        className="inline-block w-28 md:w-36 mx-1 px-3 py-1 bg-amber-200/50 rounded-md text-amber-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-200/80 transition-all"
                                                        placeholder="..."
                                                    />
                                                    {" et retrouver la trace d' "}
                                                    <input
                                                        type="text"
                                                        value={textInputs[2]}
                                                        onChange={(e) => handleTextInputChange(2, e.target.value)}
                                                        className="inline-block w-28 md:w-36 mx-1 px-3 py-1 bg-amber-200/50 rounded-md text-amber-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-200/80 transition-all"
                                                        placeholder="..."
                                                    />
                                                    {"."}
                                                </p>

                                                <p>
                                                    {"J'ai appris qu'un cœur de bois devient "}
                                                    <input
                                                        type="text"
                                                        value={textInputs[3]}
                                                        onChange={(e) => handleTextInputChange(3, e.target.value)}
                                                        className="inline-block w-28 md:w-36 mx-1 px-3 py-1 bg-amber-200/50 rounded-md text-amber-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-200/80 transition-all"
                                                        placeholder="..."
                                                    />
                                                    {" par le courage."}
                                                </p>

                                                <p>
                                                    {"J'ai compris que la musique peut briser n'importe quelle "}
                                                    <input
                                                        type="text"
                                                        value={textInputs[4]}
                                                        onChange={(e) => handleTextInputChange(4, e.target.value)}
                                                        className="inline-block w-28 md:w-36 mx-1 px-3 py-1 bg-amber-200/50 rounded-md text-amber-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-200/80 transition-all"
                                                        placeholder="..."
                                                    />
                                                    {"."}
                                                </p>

                                                <p>
                                                    {"Et j'ai accepté que nous sommes tous liés dans le grand cycle des "}
                                                    <input
                                                        type="text"
                                                        value={textInputs[5]}
                                                        onChange={(e) => handleTextInputChange(5, e.target.value)}
                                                        className="inline-block w-28 md:w-36 mx-1 px-3 py-1 bg-amber-200/50 rounded-md text-amber-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-200/80 transition-all"
                                                        placeholder="..."
                                                    />
                                                    {"."}
                                                </p>

                                                <p>
                                                    {"Et que l'amour de Wall·E pour "}
                                                    <input
                                                        type="text"
                                                        value={textInputs[6]}
                                                        onChange={(e) => handleTextInputChange(6, e.target.value)}
                                                        className="inline-block w-28 md:w-36 mx-1 px-3 py-1 bg-amber-200/50 rounded-md text-amber-900 font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-200/80 transition-all"
                                                        placeholder="..."
                                                    />
                                                    {" peut dépasser toutes les étoiles."}
                                                </p>

                                                <p className="mt-4 text-sm md:text-base text-amber-800/90 italic text-center">
                                                    {"Si vous possédez ces sept vérités, le Grimoire est à vous."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bouton de validation */}
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handlePuzzleSubmit}
                                            className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold rounded-lg shadow-lg transition-colors text-lg"
                                        >
                                            Valider
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conteneur pour le feu d'artifice - affiché seulement après le dialogue de Walt */}
                {!showDialogue && puzzleSolved && (
                    <div
                        ref={fireworksContainerRef}
                        className="absolute inset-0 pointer-events-none z-20"
                    />
                )}

                {/* Zones lumineuses */}
                {!showFirstDialogue && lightZones.map((zone, index) => (
                    <div
                        key={zone.id}
                        ref={(el) => {
                            lightZonesRef.current[index] = el;
                        }}
                        className="absolute pointer-events-none rounded-full"
                        style={{
                            top: zone.position.top,
                            left: zone.position.left,
                            transform: 'translate(-50%, -50%)',
                            width: zone.size.width,
                            height: zone.size.height,
                        }}
                    >
                        {/* Halo lumineux */}
                        <div
                            className="absolute inset-0 rounded-full blur-2xl"
                            style={{
                                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(250, 204, 21, 0.2) 50%, transparent 100%)',
                            }}
                        />
                        {/* Cercle central brillant */}
                        <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-md" />
                        {/* Particules scintillantes */}
                        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                ))}

                {/* Personnages de chaque zone affichés seulement après le premier dialogue */}
                {!showFirstDialogue && characters.map((char, index) => (
                    <div
                        key={char.id}
                        ref={(el) => {
                            charactersRef.current[index] = el;
                        }}
                        className="absolute"
                        style={{
                            top: char.position.top,
                            left: char.position.left,
                            transform: 'translate(-50%, -50%)',
                            width: char.size.width,
                            height: char.size.height,
                        }}
                    >
                        <img
                            src={char.image}
                            alt={char.id}
                            className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(251,191,36,0.6)]"
                        />
                    </div>
                ))}

                {/* Zone cliquable centrale - affichée seulement après le premier dialogue */}
                {!showFirstDialogue && !puzzleSolved && (
                    <button
                        type="button"
                        className="absolute focus:outline-none focus-visible:outline-none z-20"
                        style={{
                            top: '60%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '20%',
                            height: '20%',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            if (!puzzleSolved) {
                                setShowBookPopup(true);
                            }
                        }}
                    >
                        {/* Zone totalement invisible */}
                    </button>
                )}

                {/* Fondu noir */}
                {showFadeOut && (
                    <div
                        ref={fadeOutRef}
                        className="fixed inset-0 bg-black"
                        style={{ opacity: 0, zIndex: 9998 }}
                    />
                )}

                {/* Vidéo de fin */}
                {showVideo && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black"
                        style={{ zIndex: 9999 }}
                    >
                        <video
                            ref={videoRef}
                            src={finVideo}
                            className="w-full h-full object-contain"
                            autoPlay
                            playsInline
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChateauPage;

