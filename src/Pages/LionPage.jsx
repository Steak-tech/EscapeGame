import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../Context/GameContext.jsx';
import { gsap } from 'gsap';
import bgLion from '../assets/RoiLion.png';
import Zazu1 from '../assets/Zazu1.png';
import Zazu2 from '../assets/Zazu2.png';
import Zazu3 from '../assets/Zazu3.png';
import Zazu4 from '../assets/Zazu4.png';
import Zazu5 from '../assets/Zazu5.png';
import BulleZazu from '../assets/BulleZazu.png';


const SECRET_CODE = 'ROIS';

// Système de dialogue dédié à la page Roi Lion (avec effet machine à écrire)
const LionDialogue = ({ script, onComplete }) => {
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

    return (
        <div
            onClick={handleNext}
            className="fixed bottom-0 left-0 w-full px-4 pb-4 pt-2 z-50 cursor-pointer via-black/90 to-transparent from-amber-900 bg-gradient-to-t"
        >
            <div className="max-w-5xl mx-auto flex w-full items-end gap-6">
                {/* AVATAR ZAZU À GAUCHE (taille fixe, ne rétrécit plus) */}
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

                {/* BULLE DE DIALOGUE SPÉCIALE ZAZU (position personnalisée) */}
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

// Petit scénario de dialogue d'intro pour la zone Roi Lion
const SCENARIO_LION = [
    {
        id: 1,
        character: "Zazu",
        image: Zazu1,
        text: "Regarde bien la savane... Tout semble figé, mais les traces du passé sont encore là.",
        side: "left",
    },
    {
        id: 2,
        character: "Zazu",
        image: Zazu2,
        text: "Les rochers, les terres brûlées, les silhouettes dans l’ombre... Chaque lieu a gardé un morceau de l’histoire du roi.",
        side: "left",
    },
    {
        id: 3,
        character: "Zazu",
        image: Zazu3,
        text: "Clique sur les zones marquantes du royaume. Elles te révéleront des lettres et des indices.",
        side: "left",
    },
    {
        id: 4,
        character: "Zazu",
        image: Zazu4,
        text: "Assemble-les dans le bon ordre pour retrouver le titre de celui qui doit veiller sur la savane...",
        side: "left",
    },
];

// Configuration des positions des lettres du code révélé (en haut à droite)
// Tu peux ajuster la position de chaque lettre individuellement
const codeLettersPositions = [
    { letter: 'R', position: { top: '8%', left: '60%' }, size: { width: '80px', height: '80px' } },
    { letter: 'O', position: { top: '8%', left: '71%' }, size: { width: '80px', height: '80px' } },
    { letter: 'I', position: { top: '13%', left: '82%' }, size: { width: '80px', height: '80px' } },
    { letter: 'S', position: { top: '13%', left: '91%' }, size: { width: '80px', height: '80px' } },
];

// 11 petites zones cliquables (rouges au début pour le placement)
const lionZones = [
    { id: 1, position: { top: '53%', left: '17%' }, size: { width: '90px', height: '90px' } },
    { id: 2, position: { top: '50%', left: '83%' }, size: { width: '80px', height: '90px' } },
    { id: 3, position: { top: '55%', left: '90%' }, size: { width: '70px', height: '70px' } },
    { id: 4, position: { top: '50%', left: '31%' }, size: { width: '90px', height: '90px' } },
    { id: 5, position: { top: '79%', left: '88%' }, size: { width: '110px', height: '120px' } },
    { id: 6, position: { top: '60%', left: '8%' }, size: { width: '90px', height: '90px' } },
    { id: 7, position: { top: '89%', left: '27%' }, size: { width: '100px', height: '100px' } },
    { id: 8, position: { top: '89%', left: '71%' }, size: { width: '120px', height: '120px' } },
    { id: 9, position: { top: '66%', left: '95%' }, size: { width: '100px', height: '100px' } },
    { id: 10, position: { top: '78%', left: '13%' }, size: { width: '100px', height: '130px' } },
    { id: 11, position: { top: '51%', left: '73%' }, size: { width: '90px', height: '90px' } },

];

// 8 boutons qui affichent une lettre + 2 zones d'indice texte
const zoneLetters = {
    1: 'R',
    2: 'T',
    3: 'S',
    4: 'N',
    5: 'I',
    6: 'L',
    7: 'E',
    8: 'A',
    10: 'O',
    9: 'Le lien qui relie les groupes',
    11: 'C’est le plus fort et le plus respecté de la savane, il est considéré à sa juste valeur.',
};

const LionPage = () => {
    const [showDialogue, setShowDialogue] = useState(true);
    const [activeLetter, setActiveLetter] = useState(null);
    const [showLetter, setShowLetter] = useState(false);
    const [currentCode, setCurrentCode] = useState('');
    const [codeSolved, setCodeSolved] = useState(false);
    const [showCodeReveal, setShowCodeReveal] = useState(false);

    const letterRef = useRef(null);
    const timeoutRef = useRef(null);
    const codeLetterRefs = useRef([]);

    const navigate = useNavigate();
    const { setGameFlag, checkFlag } = useGame();

    // Vérifier que Pinocchio et Aristochats sont complétés avant d'accéder au Roi Lion
    useEffect(() => {
        if (!checkFlag('zone_pinocchio_done') || !checkFlag('zone_aristochats_done')) {
            navigate('/map');
        }
    }, [checkFlag, navigate]);

    const handleDialogueEnd = () => {
        setShowDialogue(false);
    };

    const handleZoneClick = (zoneId) => {
        // Permettre de refaire l'énigme même après l'avoir résolue
        // Si on clique sur une zone après avoir résolu, on réinitialise
        if (codeSolved) {
            setCodeSolved(false);
            setShowCodeReveal(false);
            setCurrentCode('');
        }

        const value = zoneLetters[zoneId];
        if (!value) {
            return;
        }

        setActiveLetter(value);
        setShowLetter(true);

        // Si c'est un indice texte (plusieurs caractères), on n'affecte pas le code
        if (value.length > 1) {
            return;
        }

        // Gestion de la séquence du code "ROIS"
        setCurrentCode((prev) => {
            const next = prev + value;

            // Si la nouvelle séquence ne matche plus le début du code secret -> reset
            if (!SECRET_CODE.startsWith(next)) {
                return value === SECRET_CODE[0] ? value : '';
            }

            // Si le code complet est trouvé
            if (next === SECRET_CODE) {
                setCodeSolved(true);
                setShowCodeReveal(true);
                setGameFlag('zone_lion_done', true);

                // Faire disparaître le code après 5 secondes
                setTimeout(() => {
                    setShowCodeReveal(false);
                }, 5000);

                // Rediriger vers la map après 10 secondes
                setTimeout(() => {
                    navigate('/map');
                }, 10000);
            }

            return next;
        });
    };

    // Animation GSAP pour l'apparition / disparition de la lettre ou de l'indice
    useEffect(() => {
        if (!showLetter || !letterRef.current) return;

        // On nettoie l'ancien timeout si une autre lettre est cliquée avant la fin
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const isLetter = activeLetter && activeLetter.length === 1;

        // Reset de l'état visuel
        gsap.killTweensOf(letterRef.current);

        if (isLetter) {
            // Animation pour les lettres : effet de rotation + zoom
            gsap.set(letterRef.current, {
                opacity: 0,
                scale: 0.3,
                rotation: -180,
                y: 50
            });

            // Apparition spectaculaire
            gsap.to(letterRef.current, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                y: 0,
                duration: 0.9,
                ease: 'elastic.out(1, 0.5)',
            });
        } else {
            // Animation pour les indices : effet de déploiement
            gsap.set(letterRef.current, {
                opacity: 0,
                scale: 0.6,
                y: 60
            });

            // Apparition avec effet de déploiement
            gsap.to(letterRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.4)',
            });
        }

        // Disparition automatique au bout de 5 secondes
        timeoutRef.current = setTimeout(() => {
            if (isLetter) {
                gsap.to(letterRef.current, {
                    opacity: 0,
                    scale: 0.5,
                    rotation: 180,
                    y: -50,
                    duration: 0.6,
                    ease: 'power2.in',
                    onComplete: () => {
                        setShowLetter(false);
                        setActiveLetter(null);
                    },
                });
            } else {
                gsap.to(letterRef.current, {
                    opacity: 0,
                    scale: 0.7,
                    y: 40,
                    duration: 0.6,
                    ease: 'power2.in',
                    onComplete: () => {
                        setShowLetter(false);
                        setActiveLetter(null);
                    },
                });
            }
        }, 5000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [showLetter, activeLetter]);

    // Animation de révélation du code en haut à droite
    useEffect(() => {
        if (!codeSolved || !showCodeReveal) return;

        // Petit délai pour s'assurer que les refs sont initialisées après le rechargement
        const timer = setTimeout(() => {
            // Vérifier que toutes les refs sont bien initialisées
            const allRefsReady = codeLetterRefs.current.every(ref => ref !== null && ref !== undefined);
            if (!allRefsReady || codeLetterRefs.current.length !== SECRET_CODE.length) {
                return;
            }

            gsap.killTweensOf(codeLetterRefs.current);

            // Position de départ : plus bas, plus petit, léger décalage horizontal
            codeLetterRefs.current.forEach((el, index) => {
                if (!el) return;
                gsap.set(el, {
                    opacity: 0,
                    y: 40 + index * 10,
                    x: 20 + index * 5,
                    scale: 0.4,
                    rotation: -20 + index * 10,
                });
            });

            // Timeline : chaque lettre \"vole\" vers sa position finale
            const tl = gsap.timeline();
            SECRET_CODE.split('').forEach((_, index) => {
                tl.to(
                    codeLetterRefs.current[index],
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        rotation: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                    },
                    index * 0.25
                );
            });

            // Légère oscillation flottante une fois en place
            tl.then(() => {
                codeLetterRefs.current.forEach((el) => {
                    if (!el) return;
                    gsap.to(el, {
                        y: '+=4',
                        duration: 1.8,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });
                });
            });
        }, 100); // Petit délai pour s'assurer que les refs sont initialisées

        return () => clearTimeout(timer);
    }, [codeSolved, showCodeReveal]);

    return (
        <div
            className="relative w-full h-screen text-amber-50"
            style={{ userSelect: 'none' }}
        >
            {/* Fond Lion */}
            <img
                src={bgLion}
                alt="Zone Le Roi Lion"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Révélation du code en haut à droite quand le joueur a trouvé "ROIS" */}
            {codeSolved && (
                <div className="absolute inset-0 pointer-events-none z-20">
                    {codeLettersPositions.map((config, index) => {
                        const char = SECRET_CODE[index];
                        return (
                            <div
                                key={char + index}
                                ref={(el) => {
                                    codeLetterRefs.current[index] = el;
                                }}
                                className="absolute"
                                style={{
                                    top: config.position.top,
                                    left: config.position.left,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                {/* Même style que les lettres au centre : cercle doré */}
                                <div className="relative">
                                    {/* Halo lumineux derrière */}
                                    <div className="absolute inset-0 -z-10 rounded-full bg-amber-400/20 blur-2xl scale-125" />

                                    {/* Cercle doré avec dégradé */}
                                    <div
                                        className="relative rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-4 border-amber-300/80 shadow-[0_0_40px_rgba(251,191,36,0.8),inset_0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center"
                                        style={{
                                            width: config.size.width,
                                            height: config.size.height,
                                        }}
                                    >
                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60" />

                                        {/* La lettre */}
                                        <span className="relative text-3xl md:text-4xl font-black text-amber-900 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] tracking-wider">
                                            {char}
                                        </span>
                                    </div>

                                    {/* Particules scintillantes */}
                                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Contenu principal */}
            <div className="relative z-10 w-full h-full">
                {/* Dialogue d'intro spécifique au Roi Lion */}
                {showDialogue && (
                    <LionDialogue
                        script={SCENARIO_LION}
                        onComplete={handleDialogueEnd}
                    />
                )}

                {/* 11 zones cliquables (activées seulement après le dialogue) */}
                {!showDialogue && lionZones.map((zone) => (
                    <button
                        key={zone.id}
                        type="button"
                        onClick={() => handleZoneClick(zone.id)}
                        className="absolute cursor-pointer focus:outline-none focus-visible:outline-none"
                        style={{
                            top: zone.position.top,
                            left: zone.position.left,
                            transform: 'translate(-50%, -50%)',
                            width: zone.size.width,
                            height: zone.size.height,
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                        }}
                    >
                        {/* Zone cliquable (invisible) */}
                    </button>
                ))}

                {/* Lettre ou indice animé au centre de l'écran */}
                {showLetter && activeLetter && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        {/* Si c'est une lettre (un seul caractère) */}
                        {activeLetter.length === 1 ? (
                            <div
                                ref={letterRef}
                                className="relative"
                            >
                                {/* Halo lumineux derrière */}
                                <div className="absolute inset-0 -z-10 rounded-full bg-amber-400/30 blur-3xl scale-150" />

                                {/* Cercle doré avec dégradé */}
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-4 border-amber-300/80 shadow-[0_0_60px_rgba(251,191,36,0.9),inset_0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center">
                                    {/* Effet de brillance */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60" />

                                    {/* La lettre */}
                                    <span className="relative text-7xl md:text-8xl font-black text-amber-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] tracking-wider">
                                        {activeLetter}
                                    </span>
                                </div>

                                {/* Particules scintillantes (effet visuel) */}
                                <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-amber-300 animate-ping" />
                                <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            </div>
                        ) : (
                            /* Si c'est un indice textuel (plusieurs caractères) */
                            <div
                                ref={letterRef}
                                className="relative max-w-lg mx-4"
                            >
                                {/* Fond parchemin avec effet vieilli */}
                                <div className="relative bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border-4 border-amber-800/60 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm">
                                    {/* Texture parchemin (effet de vieillissement) */}
                                    <div className="absolute inset-0 rounded-2xl opacity-20 bg-[radial-gradient(circle_at_30%_40%,rgba(139,69,19,0.3)_0%,transparent_50%)]" />

                                    {/* Bordure décorative interne */}
                                    <div className="absolute inset-2 rounded-xl border-2 border-amber-700/40" />

                                    {/* Icône de rouleau en haut */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-amber-800 rounded-full shadow-md" />

                                    {/* Contenu du texte */}
                                    <div className="relative z-10">
                                        <p className="text-amber-900 text-base md:text-lg leading-relaxed font-serif italic text-center drop-shadow-sm">
                                            {activeLetter}
                                        </p>
                                    </div>

                                    {/* Effet de lumière dorée */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/30 via-transparent to-transparent pointer-events-none" />
                                </div>

                                {/* Ombre portée pour profondeur */}
                                <div className="absolute -inset-1 bg-amber-900/20 blur-xl -z-10 rounded-2xl" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LionPage;


