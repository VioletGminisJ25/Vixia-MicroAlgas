import React, { useState } from 'react';




interface BotonesEstadosProps {
    isManual: boolean | string;
    // ... otras posibles props
}

const BotonesEstados: React.FC<BotonesEstadosProps> = ({ isManual }) => {
    const [showModal, setShowModal] = useState(false);

    const handleTomarMuestra = async () => {
        console.log("¡Botón 'Tomar muestra manual' clickeado!");
        // Aquí podrías añadir la lógica para solicitar la muestra manual
        const boton = document.getElementById('muestraManual') as HTMLButtonElement | null;
        if (boton) {
            boton.disabled = true;
        }

        try {
            const response = await fetch(import.meta.env.PUBLIC_GET_MANUAL, {
                method: 'GET',
                // Puedes añadir headers si es necesario, por ejemplo:
                // headers: {
                //   'Content-Type': 'application/json',
                //   // 'Authorization': 'Bearer YOUR_TOKEN',
                // },
            });

            if (!response.ok) {
                console.error(`Error al solicitar la muestra manual: ${response.status}`);
                const boton = document.getElementById('muestraManual') as HTMLButtonElement | null;
                if (boton) {
                    boton.disabled = true;
                }
                // Aquí podrías mostrar un mensaje de error al usuario
                return;
            }



            const data = await response.json();
            console.log("Respuesta del servidor:", data);
            // Aquí podrías manejar la respuesta del servidor,
            // por ejemplo, actualizar el estado de la aplicación
        } catch (error) {
            console.error("Error al realizar la petición GET:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }

    };

    const isManualBool = typeof isManual === "string"
        ? isManual.toLowerCase() === "true"
        : !!isManual;



    return (
        <div
            className="h-[90%] w-full
                   bg-slate-100 dark:bg-[#0f1011] p-1 rounded-lg shadow-xl dark:shadow-xl/100
                   flex flex-col justify-center items-center"
        >
            <div
                className="flex flex-col justify-center items-center w-full h-full gap-4"
            >
                <div
                    className="flex flex-row justify-center items-center w-full
                           text-black dark:text-white"
                >
                    <button

                        id="btModal"
                        className="w-1/2 h-12 rounded
                                    bg-white
                                   dark:bg-[#1d1f21] dark:text-white
                                   dark:hover:bg-neutral-700
                                      hover:bg-neutral-200"
                    >
                        Encender/Apagar
                    </button>
                </div>

                <div
                    className="flex flex-row justify-center items-center w-full
                            text-black dark:text-white"
                >
                    <button
                        id='muestraManual'
                        onClick={handleTomarMuestra}
                        disabled={!isManualBool}
                        className={`
                            w-1/2 h-12 rounded
                            transition-colors duration-200 ease-in-out
                            ${isManualBool
                                ? `bg-white text-black hover:bg-neutral-200 
                                 dark:bg-[#1d1f21] dark:text-white dark:hover:bg-neutral-700`
                                : `bg-gray-200 text-gray-400 cursor-not-allowed
                                 dark:bg-gray-700 dark:text-gray-500`}
                          `}
                    >
                        Tomar muestra manual
                    </button>
                </div>
                <div
                    className="flex flex-row justify-center items-center w-full
                            text-black dark:text-white"
                >
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-1/2 h-12 rounded
                        bg-white hover:
                                    dark:bg-[#1d1f21] dark:text-white
                                    dark:hover:bg-neutral-700
                                    hover:bg-neutral-200"
                    >
                        Cambiar parametros
                    </button>
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Cambiar parámetros</h2>

                            <form className="space-y-4 text-sm text-gray-800 dark:text-white">
                                <div>
                                    <label className="block mb-1">¿Cuál es el tiempo entre medidas? (en minutos):</label>
                                    <input type="number" step="0.1" min="0" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">¿Cuál es el tiempo de luz? (en minutos):</label>
                                    <input type="number" step="0.1" min="0" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">¿Cuál es el tiempo de oscuridad? (en minutos):</label>
                                    <input type="number" step="0.1" min="0" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz blanca (0–100):</label>
                                    <input type="number" min="0" max="100" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz azul (0–100):</label>
                                    <input type="number" min="0" max="100" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz roja (0–100):</label>
                                    <input type="number" min="0" max="100" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div
                    className="flex flex-row justify-center items-center w-full
                            text-black dark:text-white"
                >
                    <button
                        className="w-1/2 h-12 rounded
                        bg-white hover:
                                    dark:bg-[#1d1f21] dark:text-white
                                    dark:hover:bg-neutral-700
                                    hover:bg-neutral-200"
                    >
                        Guardar en excel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BotonesEstados;

