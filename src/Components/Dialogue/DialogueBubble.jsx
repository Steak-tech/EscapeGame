import React from 'react';
const DialogueBubble = ({ text, image, character, side = "left" }) => {
    const isLeft = side === "left";

    return (
        <div className={`flex w-full items-end gap-4 mb-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

            {/* AVATAR */}
            <div>
                <div className="h-100 absolute bottom-[-60px]">
                    <img src={image} alt={character} className="w-full h-full " />
                </div>
            </div>

            {/* BULLE */}
            <div className="relative w-full mb-20 justify-end flex">

                {/* 1. Image de fond */}
                <img
                    src='src/assets/bulle.png'
                    alt='bulle dialogue'
                    className='w-[60%] h-[300px] object-fill'
                />

                <div className="absolute top-0 left-85 w-[60%] h-[300px] flex flex-col justify-start p-8 sm:p-12">


                    <span className="shrink-0 block text-3xl font-bold text-amber-900 drop-shadow-md mb-2">
                        {character}
                    </span>

                    {/* Texte du dialogue */}
                    {/* 'overflow-y-auto' permet de scroller si le texte est vraiment trop long pour la bulle */}
                    <p className="text-grey-900 text-sm md:text-base leading-relaxed font-sans drop-shadow-sm overflow-y-auto pr-2">
                        {text}
                    </p>

                </div>
            </div>

        </div>
    );
};

export default DialogueBubble;