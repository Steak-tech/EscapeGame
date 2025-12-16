import React, { useState, useEffect } from 'react';
import DialogueBubble from './DialogueBubble';

const DialogueManager = ({ script, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const currentLine = script[currentIndex];

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
            // 3. Fin du dialogue
            if (onComplete) onComplete();
        }
    };

    if (!currentLine) return null;

    console.log(displayedText)

    return (
        <div
            onClick={handleNext}
            className="fixed bottom-0 left-0 w-full p-6 pb-12 via-black/90 to-transparent z-50 cursor-pointer from-amber-900 bg-gradient-to-t"
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