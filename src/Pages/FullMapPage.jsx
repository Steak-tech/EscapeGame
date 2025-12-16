import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import {useEffect} from "react";

const zonesConfig = [
    {
        id: 'pinocchio',
        label: 'Pinocchio',
        description: 'Les ruelles tordues où les fils de marionnettes semblent encore bouger...',
        position: { top: '27%', left: '27%' },
        size: { width: '40%', height: '40%' },
        radius: '50px',
        order: 0,
    },
    {
        id: 'aristochats',
        label: 'Les Aristochats',
        description: 'Les toits de Paris résonnent encore des mélodies oubliées des chats jazzy.',
        position: { top: '27%', left: '75%' },
        size: { width: '40%', height: '40%' },
        radius: '50px',
        order: 1,
    },
    {
        id: 'lion',
        label: 'Le Roi Lion',
        description: 'Une savane fanée, balayée par le vent, où les ombres murmurent le passé.',
        position: { top: '78%', left: '25%' },
        size: { width: '40%', height: '40%' },
        radius: '50px',
        order: 2,
    },
    {
        id: 'walle',
        label: 'WALL·E',
        description: 'Un dépotoir silencieux, gardé par un petit robot obstiné.',
        position: { top: '78%', left: '75%' },
        size: { width: '40%', height: '40%' },
        radius: '50px',
        order: 3,
    },
];

const FullMapPage = () => {
    const navigate = useNavigate();
    const { setGameFlag, pickupItem, checkFlag, changeRoom, setCloseMap, closeMap, setHasNavigated } = useGame();

    useEffect(() => {
        if (!checkFlag('map_puzzle_completed')) {
            navigate('/atelier');
        }
    }, []);

    const isZoneUnlocked = (zone) => {
        // On suppose que chaque zone peut être marquée comme "faite" via un flag :
        // zone_pinocchio_done, zone_aristochats_done, zone_lion_done, zone_walle_done
        const doneFlags = zonesConfig.map((z) => checkFlag(`zone_${z.id}_done`));

        if (zone.order === 0) {
            // Pinocchio est toujours disponible en premier
            return true;
        }

        // Une zone n'est accessible que si toutes les précédentes sont "done"
        for (let i = 0; i < zone.order; i += 1) {
            if (!doneFlags[i]) return false;
        }
        return true;
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black text-amber-50">
            {/* Vignette sombre autour */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_45%,rgba(0,0,0,0.9)_100%)]" />

            {/* Contenu principal */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Barre du haut */}
                <header className="flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-[0.25em] text-amber-300/70">
                            Disneyland oublié
                        </span>
                        <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-amber-100 drop-shadow-lg">
                            Table de navigation des studios
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold border border-amber-400/70 text-amber-50 bg-black/40 hover:bg-amber-400 hover:text-slate-900 transition-colors duration-200 shadow-md"
                    >
                        Revenir au parc
                    </button>
                </header>

                {/* Zone centrale avec la carte */}
                <main className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 px-4 md:px-10 pb-6 md:pb-10">
                    {/* Bloc texte / légende */}
                    <section className="w-full md:w-1/3 flex flex-col gap-4 md:gap-6">
                        <div className="bg-slate-950/60 border border-amber-500/40 shadow-2xl rounded-2xl p-4 md:p-5 backdrop-blur-sm">
                            <h2 className="text-lg md:text-xl font-bold text-amber-100 mb-2">
                                Carte des Walt Disney Studios
                            </h2>
                            <p className="text-xs md:text-sm text-amber-100/80 leading-relaxed">
                                Cette carte représente le cœur dévasté des studios. Chaque zone cache
                                des fragments d&apos;histoires oubliées, des attractions à l&apos;abandon
                                et des indices laissés par les anciens Imagineers.
                            </p>
                            <p className="mt-3 text-xs md:text-sm text-amber-200/85">
                                Utilise-la pour repérer les lieux clés, anticiper tes déplacements
                                et dénicher les prochains mystères de l&apos;escape game.
                            </p>
                        </div>

                        <div className="bg-slate-950/50 border border-amber-700/40 shadow-xl rounded-2xl p-4 space-y-3 text-xs md:text-sm tracking-wide">
                            <h3 className="text-amber-200 font-semibold text-sm md:text-base flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Points d&apos;intérêt
                            </h3>
                            <ul className="space-y-1.5 list-disc list-inside text-amber-100/85">
                                <li>Les zones les plus lumineuses indiquent les secteurs encore actifs.</li>
                                <li>Les lisières sombres et boisées cachent souvent des passages secrets.</li>
                                <li>Les grandes esplanades sont idéales pour les rencontres et révélations.</li>
                            </ul>
                            <p className="pt-1 text-[0.68rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-amber-400/80">
                                Observe. Analyse. Prépare ton prochain mouvement.
                            </p>
                        </div>
                    </section>

                    {/* Bloc carte */}
                    <section className="flex-1 flex items-center justify-center">
                        <div className="relative w-full max-w-5xl">
                            {/* Cadre décoratif */}
                            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-500/40 via-transparent to-emerald-500/30 blur-xl opacity-70" />

                            <div className="relative rounded-[2rem] overflow-hidden border border-amber-500/70 shadow-[0_0_40px_rgba(251,191,36,0.45)] bg-slate-900/70 backdrop-blur">
                                {/* Carte */}
                                <img
                                    src="src/assets/MapStudios.png"
                                    alt="Carte complète des Walt Disney Studios"
                                    className="w-full h-full max-h-[70vh] object-contain"
                                />

                                {/* Zones cliquables de la carte */}
                                {zonesConfig.map((zone) => {
                                    const unlocked = isZoneUnlocked(zone);
                                    const done = checkFlag(`zone_${zone.id}_done`);

                                    return (
                                        <button
                                            key={zone.id}
                                            type="button"
                                            onClick={() => {
                                                if (!unlocked) return;
                                                navigate(`/zone/${zone.id}`);
                                                setCloseMap(true)
                                                setHasNavigated(false)
                                                console.log('Navigation vers la zone :', hasNavigated);
                                            }}
                                            className={`
                                                absolute
                                                ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                                            `}
                                            style={{
                                                top: zone.position.top,
                                                left: zone.position.left,
                                                transform: 'translate(-50%, -50%)',
                                                width: zone.size?.width ?? '16%',
                                                height: zone.size?.height ?? '18%',
                                                borderRadius: zone.radius ?? '0px',
                                                // TEMP: fond rouge semi-transparent pour ajuster les zones
                                                backgroundColor: 'rgba(255,0,0,0.35)',
                                            }}
                                        >
                                            {/* Zone cliquable (fond rouge temporaire pour le réglage des tailles) */}
                                        </button>
                                    );
                                })}

                                {/* Bandeau bas */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center md:items-end justify-between gap-3">
                                    <div className="text-left">
                                        <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-amber-300/80">
                                            Niveau actuel
                                        </p>
                                        <p className="text-sm md:text-base font-semibold text-amber-100">
                                            Orientation &amp; repérage des studios
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[0.7rem] md:text-xs text-amber-100/80">
                                            La carte se dévoile au fil de ta progression.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default FullMapPage;


