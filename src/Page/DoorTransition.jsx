import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

// Imports des médias
import doorVideo from '../assets/DoorTransition.mp4';
import doorImage from '../assets/door.jpg';
import doorImageFaded from '../assets/door_faded.png';
import logoImage from '../assets/logo_menu.png';
import playButtonImage from '../assets/play_menu.png';
import doorKeyImage from '../assets/door_key.png';
import {useGame} from "../Context/GameContext.jsx";

// --- 1. CONFIGURATION DE LA SÉQUENCE D'INTRO ---

// Fonction de tri pour les images
const getSortedUrls = (glob) => {
    return Object.keys(glob)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .map(key => glob[key]);
};

const framesGlob = import.meta.glob('/src/assets/MenuLoad/*.png', { eager: true, as: 'url' });
const introFrameUrls = getSortedUrls(framesGlob);

const FullIntroSequence = ({ fps = 144, width = 1920, height = 1080 }) => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const [step, setStep] = useState(0);

    const [introImages, setIntroImages] = useState([]);

    const {pickupItem, hasItem, setGameFlag, checkFlag, useItem} = useGame();

    useEffect(() => {
        let loadedCount = 0;
        const total = introFrameUrls.length;
        const loadedImages = [];

        introFrameUrls.forEach((url, index) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                loadedCount++;
                loadedImages[index] = img;
                if (loadedCount === total) {
                    setIntroImages(loadedImages);
                    setStep(1);
                }
            };
        });
    }, []);

    useEffect(() => {
        if (step !== 1) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let frameIndex = 0;
        let animationId;
        let lastTime = 0;
        const interval = 1000 / fps;

        const draw = (currentTime) => {
            animationId = requestAnimationFrame(draw);

            const deltaTime = currentTime - lastTime;
            if (deltaTime < interval) return;
            lastTime = currentTime - (deltaTime % interval);

            ctx.clearRect(0, 0, width, height);
            if (introImages[frameIndex]) {
                ctx.drawImage(introImages[frameIndex], 0, 0, width, height);
            }

            frameIndex++;

            if (frameIndex >= introImages.length) {
                cancelAnimationFrame(animationId);
                setStep(2);
            }
        };

        animationId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animationId);

    }, [step, introImages, fps, width, height]);

    const handlePlayClick = () => {
        if(checkFlag('intro_door_done')) {
            setStep(4);
            return;
        }
        setStep(3);
    }


    const handleDoorClick = () => {
        setStep(5);
    };

    const handleVideoEnd = () => {
        useItem('cle_porte');
        setGameFlag('intro_door_done', true);
        navigate('/atelier');
    };

    const handleKey = () => {
        if (!hasItem('cle_porte')) {
            pickupItem('cle_porte');
        }
        setStep(4);
    }

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">


            {step === 0 && (
                <div className="text-white animate-pulse">Chargement de l'intro...</div>
            )}

            {step === 1 && (
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="w-full h-full object-cover absolute z-2000 pointer-events-none"
                />
            )}
            {(step === 1 || step === 2) &&(
                <div
                    className="w-full h-full group z-30 animate-fade-in"
                >
                    <img
                        src={doorImageFaded}
                        alt="Porte fermée"
                        className="w-full h-full object-cover relative"
                    />
                    <div className='w-200 absolute left-[50%] transform -translate-x-1/2 z-30 bottom-20'>
                        <img src={logoImage} alt="Porte fermée"  className="w-full object-cover absolute bottom-15 left-1/2 transform -translate-x-1/2"/>
                    </div>
                    <div onClick={handlePlayClick} className='w-100 absolute cursor-pointer left-[50%] transform -translate-x-1/2 z-40'>
                        <img src={playButtonImage} alt="Porte fermée" className="w-full object-cover absolute bottom-15 left-1/2 transform -translate-x-1/2"/>
                    </div>
                </div>
            )}
            {step === 3 &&(
                <>
                <div className="w-full h-full z-40 relative">
                    <img
                        src={doorImage}
                        alt="Porte fermée"
                        className="w-full h-full object-cover z-40 absolute inset-0 animate-fade-in"
                    />
                </div>
                <div onClick={handleKey} className="w-40 z-41 absolute bottom-5 right-10 cursor-pointer animate-bounce">
                    <img src={doorKeyImage}  className="w-full h-full" />
                </div>
                </>
            )
            }
            {step === 4 && (
                <div className="w-full h-full z-40 relative" onClick={handleDoorClick}>
                    <img
                        src={doorImage}
                        alt="Porte fermée"
                        className="w-full h-full object-cover z-40 absolute inset-0 animate-fade-in"
                    />
                </div>
            )}
            {step === 5 && (
                <video
                    src={doorVideo}
                    autoPlay
                    muted={false}
                    playsInline
                    className="w-full h-full object-cover z-40 absolute inset-0"
                    onEnded={handleVideoEnd}
                />
            )}
        </div>
    );
};

export default FullIntroSequence;