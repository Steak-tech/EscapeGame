import React, { useEffect, useState } from 'react';

const Notification = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            // On lance l'animation de sortie un peu avant la destruction réelle
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2500); // Reste visible 2.5 secondes

            // On appelle la fonction de nettoyage du parent (onClose) après l'animation
            const closeTimer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => {
                clearTimeout(timer);
                clearTimeout(closeTimer);
            };
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
    `}>
            <div className="bg-[#033860]/90 border border-[#FBB13C] px-6 py-4 rounded-lg shadow-[0_0_15px_rgba(251,177,60,0.4)] backdrop-blur-sm flex items-center gap-4">

                {/* Icône (Coffre ou étoile) */}
                <span className="text-2xl animate-bounce">🎁</span>

                <div className="flex flex-col">
          <span className="text-[#FBB13C] text-xs font-bold uppercase tracking-widest mb-1">
            Nouvel objet
          </span>
                    <span className="text-white font-sans font-medium text-lg">
            {message}
          </span>
                </div>

            </div>
        </div>
    );
};

export default Notification;