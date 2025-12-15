import React, { useRef, useState } from "react";
import Lottie from "lottie-react";

// Importe ton fichier JSON exporté depuis After Effects
// Assure-toi que le chemin est correct
import animationCoffre from "../assets/testLottie.json";

const Coffre = () => {
    // 1. Le "Ref" nous permet de contrôler l'animation (play, stop, pause)
    const lottieRef = useRef();

    // 2. Un état pour savoir si l'objet a déjà été fouillé
    const [estOuvert, setEstOuvert] = useState(false);

    const gererClic = () => {
        if (!estOuvert) {
            // On lance l'animation
            lottieRef.current.play();

            // On note que le coffre est ouvert pour ne pas le ré-ouvrir
            setEstOuvert(true);

            // --- LOGIQUE ESCAPE GAME ---
            // C'est ici que tu appellerais ta fonction pour ajouter l'objet à l'inventaire
            console.log("Bravo ! Tu as trouvé une clé !");
        }
    };

    return (
        <div
            onClick={gererClic}
            style={{ cursor: estOuvert ? 'default' : 'pointer', width: 200 }}
        >
            <Lottie
                lottieRef={lottieRef}       // On lie notre référence
                animationData={animationCoffre} // Le fichier JSON
                autoplay={false}            // IMPORTANT : Ne pas lancer l'anim tout de suite
                loop={false}                // IMPORTANT : Ne pas boucler (le coffre reste ouvert)
            />
        </div>
    );
};

export default Coffre;