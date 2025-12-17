import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../Context/GameContext.jsx';
import bgPinocchio from '../assets/pinocchio.png';
import imgInsigne from '../assets/Insigne.png';
import imgLanterne from '../assets/Lanterne.png';
import imgMiroir from '../assets/Miroir.png';
import imgPantinBavard from '../assets/Pantin Bavard.png';
import imgPantinGuerrier from '../assets/Pantin Guerrier.png';
import imgPantinSauvage from '../assets/Pantin Sauvage.png';
import imgCartePino from '../assets/cartepino.png';
import BulleZazu from '../assets/BulleZazu.png';
import Gemini1 from '../assets/Gemini1.png';
import Gemini2 from '../assets/Gemini2.png';
import Gemini3 from '../assets/Gemini3.png';
import Gemini4 from '../assets/Gemini4.png';
import Gemini5 from '../assets/Gemini5.png';

// Configuration des 6 images à relier
const pinocchioImages = [
    {
        id: 1,
        src: imgInsigne,
        position: { top: '7%', left: '44%' },
        size: { width: '40px', height: 'auto' },
    },
    {
        id: 2,
        src: imgLanterne,
        position: { top: '74%', left: '94%' },
        size: { width: '145px', height: 'auto' },
    },
    {
        id: 3,
        src: imgMiroir,
        position: { top: '80%', left: '8%' },
        size: { width: '180px', height: 'auto' },
    },
    {
        id: 4,
        src: imgPantinBavard,
        position: { top: '67%', left: '83%' },
        size: { width: '150px', height: 'auto' },
    },
    {
        id: 5,
        src: imgPantinGuerrier,
        position: { top: '61%', left: '19%' },
        size: { width: '180px', height: 'auto' },
    },
    {
        id: 6,
        src: imgPantinSauvage,
        position: { top: '37%', left: '92%' },
        size: { width: '210px', height: 'auto' },
    },
];

// Mots affichés pour chaque paire validée (à adapter)
const linkWords = {
    '1-6': 'CONSCIENCE',
    '3-4': 'VÉRITÉ',
    '2-5': 'COURAGE',
};

const normalizePairKey = (a, b) => {
    const [x, y] = a < b ? [a, b] : [b, a];
    return `${x}-${y}`;
};

// Zone finale cliquable, que tu peux déplacer comme tu veux
const finalZone = {
    position: { top: '37%', left: '50%' },
    size: { width: '400px', height: '300px' },
};

// --- Dialogue dédié à la page Pinocchio (même logique que LionPage) ---
const PinocchioDialogue = ({ script, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const currentLine = script[currentIndex];

    // Retour à la ligne automatique
    const wrapText = (text, maxCharsPerLine = 55) => {
        if (!text) return '';
        const words = text.split(' ');
        const lines = [];
        let currentLineText = '';

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
        return lines.join('\n');
    };

    const fullText = currentLine ? wrapText(currentLine.text) : '';

    // Effet machine à écrire
    useEffect(() => {
        if (!currentLine) return;

        setDisplayedText('');
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
        // Spam clic : si ça tape encore, on affiche tout d'un coup
        if (isTyping && currentLine) {
            if (displayedText !== fullText) {
                setDisplayedText(fullText);
            }
            setIsTyping(false);
            return;
        }

        // Sinon, on passe à la réplique suivante
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
                {/* AVATAR PANTIN À GAUCHE (même positionnement que Zazu) */}
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

                {/* BULLE DE DIALOGUE (mêmes image et position que pour Zazu) */}
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

// Petit scénario de dialogue d'intro pour la zone Pinocchio (similaire au Lion)
const SCENARIO_PINOCCHIO = [
    {
        id: 1,
        character: 'Gemini',
        image: Gemini1,
        text: "Bienvenue dans l'atelier de Gepetto… Chaque objet ici garde la trace d'un choix, d'un mensonge ou d'un acte de courage.",
        side: 'left',
    },
    {
        id: 2,
        character: 'Gemini',
        image: Gemini2,
        text: 'Regarde bien les pantins et les objets autour de toi. Ils ont chacun une histoire à raconter.',
        side: 'left',
    },
    {
        id: 3,
        character: 'Gemini',
        image: Gemini3,
        text: "Chaque pantin et objet est lié à un mot clé. Relie-les pour révéler leur secret.",
        side: 'left',
    },
    {
        id: 4,
        character: 'Gemini',
        image: Gemini4,
        text: "Mais attention, il suffit d'un lien faux pour tout effondrer.",
        side: 'left',
    },
    {
        id: 5,
        character: 'Gemini',
        image: Gemini5,
        text: "Quand tu auras relier tous les pantins et objets sans erreur, tu pourras compléter la prophétie et aider Pinocchio à devenir vraiment vivant.",
        side: 'left',
    },
];

const PinocchioPage = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [links, setLinks] = useState([]);
    const [showFinalModal, setShowFinalModal] = useState(false);
    const [wordVrai, setWordVrai] = useState('');
    const [wordConscience, setWordConscience] = useState('');
    const [wordVerite, setWordVerite] = useState('');
    const [wordCourage, setWordCourage] = useState('');
    const [finalError, setFinalError] = useState('');
    const [showDialogue, setShowDialogue] = useState(true);

    const navigate = useNavigate();
    const { setGameFlag, checkFlag, playMusic } = useGame();

    // Vérifier que le puzzle de la carte est complété avant d'accéder à Pinocchio
    useEffect(() => {
        if (!checkFlag('map_puzzle_completed')) {
            navigate('/map');
        }
        playMusic('pinocchio');
    }, [checkFlag, navigate]);

    const handleImageClick = (id) => {
        // Premier clic : on sélectionne l'image
        if (!selectedId) {
            setSelectedId(id);
            return;
        }

        // Deuxième clic : même image -> on désélectionne
        if (selectedId === id) {
            setSelectedId(null);
            return;
        }

        const pairKey = normalizePairKey(selectedId, id);

        // Si la paire n'est pas une combinaison valide -> reset complet
        const isValidPair = !!linkWords[pairKey];
        if (!isValidPair) {
            setLinks([]);
            setSelectedId(null);
            return;
        }

        // Vérifier si le lien existe déjà
        const alreadyLinked = links.some(
            (l) => normalizePairKey(l.from, l.to) === pairKey,
        );
        if (!alreadyLinked) {
            setLinks((prev) => [...prev, { from: selectedId, to: id }]);
        }

        setSelectedId(null);
    };

    // Récupération des mots pour les liens trouvés
    const foundWords = Array.from(
        new Set(
            links
                .map((l) => linkWords[normalizePairKey(l.from, l.to)])
                .filter(Boolean),
        ),
    );

    const allWordsFound = foundWords.length === Object.keys(linkWords).length;

    const handleValidateFinalText = () => {
        const normalize = (str) =>
            str
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // accents
                .replace(/[^A-Z0-9]/g, '') // enlève ponctuation et espaces
                .trim();

        const okVrai = normalize(wordVrai) === 'VIVANT';
        const okConscience = normalize(wordConscience) === 'CONSCIENCE';
        const okVerite = normalize(wordVerite) === 'VERITE';
        const okCourage = normalize(wordCourage) === 'COURAGE';

        if (okVrai && okConscience && okVerite && okCourage) {
            setGameFlag('zone_pinocchio_done', true);
            setShowFinalModal(false);
            navigate('/map');
        } else {
            setFinalError('Un ou plusieurs mots sont incorrects. Vérifie bien chaque case.');
        }
    };

    const handleDialogueEnd = () => {
        setShowDialogue(false);
    };

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-black text-amber-50"
            style={{ userSelect: 'none' }}
        >
            {/* Fond Pinocchio */}
            <img
                src={bgPinocchio}
                alt="Pinocchio"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Voile sombre pour lisibilité */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Contenu principal */}
            <div className="relative z-10 w-full h-full">

                {/* Dialogue d'intro Pinocchio (propre à cette page) */}
                {showDialogue && (
                    <PinocchioDialogue
                        script={SCENARIO_PINOCCHIO}
                        onComplete={handleDialogueEnd}
                    />
                )}

                {/* Zone de jeu (après le dialogue) */}
                {!showDialogue && (
                    <div className="absolute inset-0">
                        {/* Images cliquables / zones de drag & drop */}
                        {pinocchioImages.map((img) => {
                            const isSelected = selectedId === img.id;
                            const isTarget = img.id === 4 || img.id === 5 || img.id === 6;
                            const isSource = !isTarget;
                            return (
                                <button
                                    key={img.id}
                                    type="button"
                                    onClick={() => handleImageClick(img.id)}
                                    draggable={isSource}
                                    onDragStart={
                                        isSource
                                            ? (e) => {
                                                e.dataTransfer.setData('text/plain', String(img.id));
                                                e.dataTransfer.effectAllowed = 'move';
                                                setSelectedId(img.id);
                                            }
                                            : undefined
                                    }
                                    onDragOver={
                                        isTarget
                                            ? (e) => {
                                                e.preventDefault();
                                                e.dataTransfer.dropEffect = 'move';
                                            }
                                            : undefined
                                    }
                                    onDrop={
                                        isTarget
                                            ? (e) => {
                                                e.preventDefault();
                                                const fromId = Number(
                                                    e.dataTransfer.getData('text/plain'),
                                                );
                                                if (!fromId) return;
                                                setSelectedId(fromId);
                                                handleImageClick(img.id);
                                            }
                                            : undefined
                                    }
                                    className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:outline-none"
                                    style={{
                                        top: img.position.top,
                                        left: img.position.left,
                                        width: img.size?.width,
                                        height: img.size?.height,
                                        outline: 'none',
                                    }}
                                >
                                    {/* Image qui remplit le bouton, sans fond supplémentaire */}
                                    <img
                                        src={img.src}
                                        alt={`Indice ${img.id}`}
                                        className="w-full h-full object-contain block"
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Mots trouvés */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-amber-500/60 min-w-[260px] text-center">
                    <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-amber-300/80 mb-1">
                        Mots révélés
                    </p>
                    {foundWords.length === 0 ? (
                        <p className="text-xs md:text-sm text-amber-50/80">
                            Aucun mot pour l&apos;instant. Observe bien les images...
                        </p>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2">
                            {foundWords.map((word) => (
                                <span
                                    key={word}
                                    className="px-2 py-1 text-xs md:text-sm font-semibold rounded-full bg-amber-500/20 border border-amber-400/70 text-amber-100"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Zone cliquable finale (invisible) active seulement si tous les mots sont trouvés */}
                {allWordsFound && (
                    <button
                        type="button"
                        onClick={() => {
                            setShowFinalModal(true);
                            setFinalError('');
                        }}
                        className="absolute cursor-pointer"
                        style={{
                            top: finalZone.position.top,
                            left: finalZone.position.left,
                            transform: 'translate(-50%, -50%)',
                            width: finalZone.size.width,
                            height: finalZone.size.height,
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                        }}
                    >
                        {/* Zone totalement invisible */}
                    </button>
                )}

                {/* Popup finale : texte à trou */}
                {showFinalModal && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
                        <div
                            className="w-11/12 max-w-3xl h-[580px] md:h-[640px] rounded-2xl border border-amber-500/60 shadow-2xl relative overflow-hidden"
                            style={{
                                backgroundImage: `url(${imgCartePino})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {/* voile sombre sur l'image */}
                            <div className="absolute inset-0 bg-black/40" />

                            {/* Contenu en bas de l'image */}
                            <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-6">
                                {/* Panneau semi-transparent et flou pour ne pas masquer l'image de fond */}
                                <div className="bg-slate-900/40 backdrop-blur-md rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-lg">
                                    <p className="text-xs md:text-sm text-amber-50/90 mb-2 leading-relaxed">
                                        Complète seulement les mots manquants de la prophétie :
                                    </p>

                                    <p className="text-[0.7rem] md:text-xs text-amber-200/90 italic mb-3 leading-relaxed">
                                        &laquo; Le bois ne suffit pas. Pour que le cœur batte et que l&apos;enfant soit{' '}
                                        <input
                                            type="text"
                                            value={wordVrai}
                                            onChange={(e) => {
                                                setWordVrai(e.target.value);
                                                setFinalError('');
                                            }}
                                            className="inline-block px-2 py-0.5 mx-1 rounded bg-slate-900/70 border border-slate-500 text-amber-50 text-[0.7rem] md:text-xs w-16 text-center"
                                            placeholder="..."
                                        />
                                        , il faut assembler trois dons : la{' '}
                                        <input
                                            type="text"
                                            value={wordConscience}
                                            onChange={(e) => {
                                                setWordConscience(e.target.value);
                                                setFinalError('');
                                            }}
                                            className="inline-block px-2 py-0.5 mx-1 rounded bg-slate-900/70 border border-slate-500 text-amber-50 text-[0.7rem] md:text-xs w-28 text-center"
                                            placeholder="..."
                                        />{' '}
                                        pour le guider, la{' '}
                                        <input
                                            type="text"
                                            value={wordVerite}
                                            onChange={(e) => {
                                                setWordVerite(e.target.value);
                                                setFinalError('');
                                            }}
                                            className="inline-block px-2 py-0.5 mx-1 rounded bg-slate-900/70 border border-slate-500 text-amber-50 text-[0.7rem] md:text-xs w-24 text-center"
                                            placeholder="..."
                                        />{' '}
                                        pour le libérer, et le{' '}
                                        <input
                                            type="text"
                                            value={wordCourage}
                                            onChange={(e) => {
                                                setWordCourage(e.target.value);
                                                setFinalError('');
                                            }}
                                            className="inline-block px-2 py-0.5 mx-1 rounded bg-slate-900/70 border border-slate-500 text-amber-50 text-[0.7rem] md:text-xs w-24 text-center"
                                            placeholder="..."
                                        />{' '}
                                        pour affronter le monde. &raquo;
                                    </p>

                                    {finalError && (
                                        <p className="text-xs text-red-400 mb-2">
                                            {finalError}
                                        </p>
                                    )}

                                    <div className="mt-1 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowFinalModal(false)}
                                            className="px-3 py-1.5 text-xs md:text-sm rounded-md bg-slate-900/80 text-slate-100 hover:bg-slate-800/90 border border-slate-600"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleValidateFinalText}
                                            className="px-4 py-1.5 text-xs md:text-sm rounded-md bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400"
                                        >
                                            Valider
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PinocchioPage;


