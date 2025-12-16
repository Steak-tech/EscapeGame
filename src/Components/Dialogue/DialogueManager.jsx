import React, { useState, useEffect } from 'react';
import DialogueBubble from './DialogueBubble';
import { gsap } from 'gsap';
import { useRef } from 'react';

const DialogueManager = ({ script, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const containerRef = useRef(null);

    const currentLine = script[currentIndex];

    // --- ANIMATION GSAP : APPARITION AU DÉBUT ---
    useEffect(() => {
        if (!containerRef.current) return;

        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
            }
        );
    }, []);

    // --- EFFET MACHINE À ÉCRIRE ---
    useEffect(() => {
        if (!currentLine) return;

        setDisplayedText("");
        setIsTyping(true);

        let charIndex = -1;
        const typingInterval = setInterval(() => {
            if (charIndex < currentLine.text.length) {
                setDisplayedText(prev => prev + currentLine.text.charAt(charIndex));
                charIndex++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);
            }
        }, 30); // Vitesse de frappe (plus petit = plus vite)

        return () => clearInterval(typingInterval);
    }, [currentIndex, currentLine]);

    // --- GESTION DU CLIC (SUIVANT) ---
    const handleNext = () => {

        // 2. Sinon, on passe à la bulle suivante
        if (currentIndex < script.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // 3. Fin du dialogue : on anime la disparition en douceur
            if (onComplete && containerRef.current) {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    ease: 'power3.in',
                    onComplete,
                });
            } else if (onComplete) {
                onComplete();
            }
        }
    };

    if (!currentLine) return null;
    return (
        <div
            ref={containerRef}
            onClick={handleNext}
            className="fixed bottom-0 left-0 w-full p-6 pb-12 via-black/90 to-transparent z-50 cursor-pointer from-yellow-700 bg-gradient-to-t"
        >
            <div className="max-w-4xl mx-auto">
                <DialogueBubble
                    key={currentLine.id} // Important pour reset l'animation à chaque changement
                    character={currentLine.character}
                    image={currentLine.image}
                    side={currentLine.side}
                    text={displayedText}
                />

            </div>
        </div>
    );
};

export default DialogueManager;