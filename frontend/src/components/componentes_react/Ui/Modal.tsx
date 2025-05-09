// componentes_react/Ui/Modal.jsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose  }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#1d1f21] p-6 rounded-lg relative">
        <input type="text" />fsfsaf
        <button
          className="absolute top-2 right-2 text-white dark:text-white"
          onClick={onClose}
        >
          fsafafs
        </button>
        <input type="text" />fsfsaf
        <button
          className="absolute top-2 right-2 text-white dark:text-white"
          
        >
          fsafafs
        </button>
      </div>
    </div>
  );
};

export default Modal;
