import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import doorVideo from '../assets/DoorTransition.mp4';
import doorImage from '../assets/door.jpg';

export default function DoorTransition() {
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate(); // Le hook de navigation

    function handleClick() {
        setIsClicked(true);
    }

    const handleVideoEnd = () => {
        navigate('/atelier');
    };

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
            {isClicked ? (
                <video
                    src={doorVideo}
                    autoPlay
                    className="w-full h-full object-cover z-50"
                    onEnded={handleVideoEnd}
                    playsInline
                />
            ) : (
                <div onClick={handleClick} className="w-full h-full cursor-pointer relative group">
                    <img
                        src={doorImage}
                        alt="Door Transition"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </div>
    );
}