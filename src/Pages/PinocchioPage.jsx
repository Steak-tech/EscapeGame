import React, { useState } from 'react';
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

// Zone finale cliquable (invisible), que tu peux déplacer comme tu veux
const finalZone = {
    position: { top: '37%', left: '50%' },
    size: { width: '400px', height: '300px' },
};

const PinocchioPage = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [links, setLinks] = useState([]); // [{from,to}]
    const [showFinalModal, setShowFinalModal] = useState(false);
    const [wordVrai, setWordVrai] = useState('');
    const [wordConscience, setWordConscience] = useState('');
    const [wordVerite, setWordVerite] = useState('');
    const [wordCourage, setWordCourage] = useState('');
    const [finalError, setFinalError] = useState('');

    const navigate = useNavigate();
    const { setGameFlag } = useGame();

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
            setLinks([]);          // on efface tous les liens trouvés
            setSelectedId(null);   // on enlève la sélection
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

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-black text-amber-50"
            style={{ userSelect: 'none' }} // évite les zones bleues de sélection au double-clic
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
                {/* Zone de jeu */}
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
                                            // On indique que c'est un mouvement, pas une copie (évite le +)
                                            e.dataTransfer.effectAllowed = 'move';
                                            setSelectedId(img.id);
                                        }
                                        : undefined
                                }
                                onDragOver={
                                    isTarget
                                        ? (e) => {
                                            e.preventDefault();
                                            // Cohérent avec effectAllowed pour ne pas afficher le +
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
                                    // IMPORTANT : la taille est portée par le bouton
                                    // pour que les valeurs en % soient bien appliquées
                                    width: img.size?.width,
                                    height: img.size?.height,
                                    outline: 'none', // sécurité supplémentaire contre le halo bleu natif
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
                            // Zone finale invisible en prod (aucun fond)
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


