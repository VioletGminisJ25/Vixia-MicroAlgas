// src/pages/LoginPage.tsx (o donde decidas ubicarlo)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import { toast, ToastContainer } from 'react-toastify'; // Importa toast y ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify

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
            });

            const data = await response.json(); // Parsea la respuesta JSON
            console.log(response)
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
                        errorMessage = data.message || 'Contraseña email incorrectos';
                        break;
                    default:
                        errorMessage = data.message || data.error;
                        break;
                }
                toast.error(errorMessage); // Muestra el error como un toast
                return;
            }

            // Si la autenticación es exitosa
            // Si tu API devuelve un token, lo guardarías aquí
            // localStorage.setItem('authToken', data.token);
            localStorage.setItem('isAuth', 'true'); // Ejemplo de bandera de autenticación
            toast.success('¡Inicio de sesión exitoso!'); // Notificación de éxito
            navigate('/'); // Redirige a la página principal usando useNavigate
        } catch (error) {
            console.error('Error de red:', error);
            toast.error('No se pudo conectar con el servidor.'); // Muestra error de red como un toast
        }
    };

    return (
        <div className="h-[90vh] flex items-center justify-center dark:text-white">
            <form
                id="login-form" // El ID no es estrictamente necesario en React si no lo usas para manipulaciones DOM directas
                className="w-full max-w-xl space-y-20 bg-gray-100 dark:bg-[#0f1011] p-4 rounded-lg shadow-lg dark:shadow-lg/100"
                onSubmit={handleSubmit} // Asocia la función handleSubmit al evento submit
            >
                <h2 className="text-2xl font-bold text-center dark:text-white text-gray-700">
                    Iniciar sesión
                </h2>

                <div>
                    <label
                        htmlFor="email" // htmlFor en lugar de for
                        className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={email} // Controla el valor del input con el estado
                        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado en cada cambio
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={password} // Controla el valor del input con el estado
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado en cada cambio
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                    Iniciar sesión
                </button>

                <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-4">
                    No tienes cuenta?{' '}
                    <a
                        href="/register" // Usar Link de react-router-dom si /register es otra ruta de tu SPA
                        className="text-[#0348DD] hover:text-[#729EFD] dark:text-[#78A2FC] dark:hover:text-[#AFC8FD] transition-colors"
                    >
                        Regístrate aquí
                    </a>
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