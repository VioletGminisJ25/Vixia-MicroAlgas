// src/pages/RegisterPage.tsx (o donde decidas ubicarlo)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import { toast, ToastContainer } from 'react-toastify'; // Importa toast y ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify

// Si tienes una interfaz para la respuesta del registro, podrías definirla
interface RegisterResponse {
    message: string;
    // Podrías tener otras propiedades, como un userId, si tu API las devuelve
}

export default function RegisterPage() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        try {
            // Asegúrate de que tu variable de entorno en Vite para el registro sea VITE_REGISTER_URL
            const response = await fetch(import.meta.env.VITE_REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }), // Envía los datos del formulario
            });

            // No siempre necesitas parsear la respuesta si solo te interesa el status,
            // pero es buena práctica hacerlo si el backend envía mensajes en JSON.
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                console.log('Usuario registrado exitosamente:', data.message);
                toast.success('¡Registro exitoso! Por favor, inicia sesión.'); // Notificación de éxito
                navigate('/login'); // Redirige a la página de login
            } else {
                // Manejo de errores de la API
                const status = response.status;
                let errorMessage = 'Ocurrió un error al registrar. Inténtalo de nuevo.';

                // Puedes mejorar el manejo de errores basándote en los códigos de estado
                // y los mensajes que tu backend envíe.
                switch (status) {
                    case 400:
                        errorMessage = data.message || 'Ese usuario ya existe';
                        break;
                }
                toast.error(errorMessage); // Muestra el error como un toast
            }
        } catch (error) {
            console.error('Error de red:', error);
            toast.error('No se pudo conectar con el servidor.'); // Muestra error de red como un toast
        }
    };

    return (
        <div className="h-[90vh] flex items-center justify-center">
            <form
                className="w-full max-w-xl space-y-20 bg-gray-100 dark:bg-[#0f1011] p-4 rounded-lg shadow-lg dark:shadow-lg/100 text-black dark:text-white"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-center dark:text-white text-black">
                    Registrarse
                </h2>

                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                    Registrarse
                </button>

                <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-4">
                    Ya tienes una cuenta?{' '}
                    {/* Usar Link si /login es una ruta de react-router-dom */}
                    <a
                        href="/login"
                        className="text-[#0348DD] hover:text-[#729EFD] dark:text-[#78A2FC] dark:hover:text-[#AFC8FD] transition-colors"
                    >
                        Inicia sesión
                    </a>
                </p>
            </form>
            {/* ToastContainer para mostrar las notificaciones */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
}