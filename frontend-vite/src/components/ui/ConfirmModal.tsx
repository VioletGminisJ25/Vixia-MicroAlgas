import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/25 dark:bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1d1f21] rounded-lg p-6 shadow-lg">
                <h2 className="text-black dark:text-white text-lg font-bold mb-4">¿Estás seguro?</h2>
                <p className="text-black dark:text-white mb-6">Esta acción eliminará la medición seleccionada de forma permanente.</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;