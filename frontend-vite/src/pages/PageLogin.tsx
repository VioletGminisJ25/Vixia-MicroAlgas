// src/pages/LoginPage.tsx (o donde decidas ubicarlo)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import { toast, ToastContainer } from 'react-toastify'; // Importa toast y ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify
import { Link } from 'react-router-dom';
// Si tienes una interfaz para la respuesta del login, podrías definirla

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        try {
            const response = await fetch(import.meta.env.VITE_LOGIN_URL, { // Usa VITE_API_URL o VITE_PUBLIC_LOGIN_URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json(); // Parsea la respuesta JSON

            if (!response.ok) {
                // Manejo de errores de la API
                const status = response.status;
                let errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';

                switch (status) {
                    case 400:
                        errorMessage = data.message || data.error;
                        break;
                    case 401:
                    case 404:
                        errorMessage = data.message || data.error;
                        break;
                    default:
                        errorMessage = data.message || data.error;
                        break;
                }
                toast.error(errorMessage); // Muestra el error como un toast
                return;
            }

            toast.success('¡Inicio de sesión exitoso!'); // Notificación de éxito
            navigate('/'); // Redirige a la página principal usando useNavigate
        } catch (error) {
            console.error('Error de red:', error);
            toast.error('No se pudo conectar con el servidor.'); // Muestra error de red como un toast
        }
    };

    return (
        <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-green-50 via-20% to-green-300 dark:from-[#0f1011] dark:via-[#0f1011] dark:via-20% dark:to-green-950 px-4">
            <form
                id="login-form"
                className="w-full max-w-xl space-y-8 bg-white dark:bg-[#1c1d1f] p-8 rounded-xl dark:shadow-xl/100 shadow-2xl"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-extrabold text-center text-emerald-500">
                    Iniciar sesión
                </h2>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </span>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu.email@ejemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Contraseña
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"></path></svg>
                        </span>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform active:scale-98"
                >
                    Iniciar sesión
                </button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    ¿No tienes cuenta?{' '}
                    <Link to={'/register'} className="font-medium text-emerald-500 hover:text-emerald-300">Regístrate aquí</Link>
                </p>
            </form>
            {/* ToastContainer para mostrar las notificaciones */}
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                limit={3}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
}