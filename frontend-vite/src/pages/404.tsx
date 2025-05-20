// src/pages/PageNotFound.tsx
import React from 'react';
import Heather from '../components/Heather'; // Asegúrate de que la ruta sea correcta

export default function PageNotFound() {
    return (
        <>
            <div
                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4"
            >
                <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
                    La página que buscas no existe
                </p>
                <p className="text-6xl sm:text-8xl font-bold text-blue-600">404</p>
                <a href="/" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                    Volver a la página principal
                </a>
            </div>
        </>
    );
}