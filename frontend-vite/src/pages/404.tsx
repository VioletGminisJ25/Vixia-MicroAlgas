// src/pages/PageNotFound.tsx

import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <>
            <div
                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4"
            >
                <p className="text-xl sm:text-2xl text-white-700 dark:text-gray-300">
                    La página que buscas no existe
                </p>
                <p className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-green-700 to-green-400 text-transparent bg-clip-text">404</p>
                <Link to={"/"} className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300">Volver a la página principal</Link>
            </div>
        </>
    );
}