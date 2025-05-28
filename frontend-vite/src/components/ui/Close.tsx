import React from 'react';

interface CloseButtonProps {
    onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
    return (
        <div className="relative">
            <button
                onClick={onClick}
                className="relative w-8 h-8 rounded-full border-none bg-[rgba(180,83,107,0.11)] transition-colors duration-500 hover:bg-red-700 active:bg-[rgb(130,0,0)] group"
            >
                <span className="absolute top-1/2 left-1/2 w-4 h-[1.5px] bg-white transform -translate-x-1/2 rotate-45" />
                <span className="absolute top-1/2 left-1/2 w-4 h-[1.5px] bg-white transform -translate-x-1/2 -rotate-45" />
                <div className="absolute flex items-center justify-center px-3 py-1 text-xs w-12 h-7 bg-[rgb(19,22,24)] text-[rgb(187,229,236)] rounded top-[-70%] left-1/2 transform -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 delay-[250ms]">
                    Close
                </div>
            </button>
        </div>
    );
};

export default CloseButton;
