
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import type { Config } from '../../interface/Global_Interface';
import Close from "../ui/Close"
import { data } from 'react-router-dom';
interface BotonesEstadosProps {
    isManual: boolean | null;
    isWake: boolean | null;
    // ... otras posibles props
}
const ArduinoController: React.FC<BotonesEstadosProps> = ({ isManual, isWake }) => {
    const [showModal, setShowModal] = useState(false);
    const [config, setConfig] = useState<Config>({
        time_between_measurements: '',
        time_light: '',
        time_dark: '',
        light_white: '',
        light_blue: '',
        light_red: ''
    });

    const handleTomarMuestra = () => {
        console.log("¡Botón 'Tomar muestra manual' clickeado!");
        // Aquí podrías añadir la lógica para solicitar la muestra manual
        const boton = document.getElementById('muestraManual') as HTMLButtonElement | null;
        if (boton) {
            boton.disabled = true;
        }

        toast.promise(
            fetch(import.meta.env.VITE_GET_MANUAL, { method: 'GET' })
                .then(response => {
                    if (!response.ok) {
                        console.error(`Error al solicitar la muestra manual: ${response.status}`);
                        const boton = document.getElementById('muestraManual') as HTMLButtonElement | null;
                        if (boton) {
                            boton.disabled = true;
                        }
                        return;
                    }
                    return response.json();
                }).catch(error => {
                    console.error("Error al realizar la petición GET:", error);
                }), {
            pending: 'Tomando medida...',
            success: 'Datos procesados',
            error: 'Algo salio mal...💀'
        })
    };

    const handleRecibirMuestras = () => {
        console.log("¡Botón 'Recibir Muestras' clickeado!");

        const boton = document.getElementById('recibirDatos') as HTMLButtonElement | null;
        if (boton) {
            boton.textContent = isWake ? "Apagar" : "Encender";
        }
        fetch(import.meta.env.VITE_WAKE_UP, { method: 'GET' })
            .then()
            .catch()

    };

    const handleRellenarCampos = () => {
        fetch(import.meta.env.VITE_GET_CONFIG, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(response)
                return response.json(); // Devuelve la promesa del JSON
            })
            .then(data => {
                console.log(data);
                setConfig(data);
            })
            .catch(error => {
                console.log(data);
                console.error("Error al obtener la configuración:", error);
            });
    };

    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("check!");
        setShowModal(false);
        toast.promise(
            fetch(import.meta.env.VITE_CHANGE_CONFIG, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            })
                .then(response => {
                    if (!response.ok) {
                        console.error(`Error al guardar la configuración: ${response.status}`);
                        throw new Error('Error al guardar la configuración');
                    }
                    console.log("Configuración guardada exitosamente");
                })
                .catch(error => {
                    console.error("Error al realizar la petición para guardar la configuración:", error);
                    throw error;
                })
                .finally(() => {

                }),
            {
                pending: 'Cambiando configuracion del arduino...',
                success: 'Configuracion modificada',
                error: 'Algo salió mal... 💀'
            }
        );
    };

    const handleOnExport = () => {
        const formattedDate = new Date().toISOString().toString().split('.')[0]; // Ej: "2025-05-22T13:40:45"

        // Codifica la fecha para que sea segura en la URL
        const encodedDate = encodeURIComponent(formattedDate);

        // Construye la URL con el query parameter
        // Asumo que tu VITE_SAVE_EXPORT es algo como "http://localhost:5000/api/save_export"
        const baseUrl = import.meta.env.VITE_SAVE_EXPORT;
        const urlWithQuery = `${baseUrl}?fecha=${encodedDate}`; // Añade ?parametro=valor

        fetch(urlWithQuery, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al exportar Excel");
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "datos_vixia_microalgas_recientes.xlsx";  // 👈 Aquí puedes cambiar el nombre si quieres
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();  // 👈 Esto abre la ventana de guardar
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error("Error al descargar archivo:", error);
            });
    }

    const isManualBool = typeof isManual === "string"
        ? isManual === "true"
        : !!isManual;

    return (
        <div
            className="h-fit w-60 bg-slate-100 dark:bg-[#0f1011] rounded-lg p-4 mt-20"
        >
            <p className="text-black dark:text-white text-xl font-semibold mb-8 text-center">Controles</p> {/* Clase para el título y un margen inferior */}
            <div
                className="flex flex-col justify-center items-center w-full h-full gap-4"
            >
                <div
                    className="flex flex-row justify-center items-center w-full
                           text-black dark:text-white"
                >
                    <button
                        itemID='recibirDatos'
                        onClick={handleRecibirMuestras}
                        id="recibirMuestras"
                        className="w-[75%] h-12 rounded
                                    bg-white
                                   dark:bg-[#1d1f21] dark:text-white
                                   dark:hover:bg-neutral-700
                                      hover:bg-neutral-200"
                    >
                        {isWake ? "Apagar" : "Encender"}
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
                            w-[75%] h-12 rounded
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
                        onClick={() => { setShowModal(true); handleRellenarCampos() }}
                        className="w-[75%] h-12 rounded
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
                        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg w-96 relative"> {/* Añadimos 'relative' aquí */}
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Cambiar parámetros</h2>
                            <Close onClick={() => setShowModal(false)} /> {/* Usamos el componente Close */}
                            <form className="space-y-4 text-sm text-gray-800 dark:text-white" onSubmit={handleOnSubmit}>
                                <div>
                                    <label className="block mb-1">¿Cuál es el tiempo entre medidas? (en minutos):</label>
                                    <input value={config?.time_between_measurements} name='time_between_measurements' onChange={(e) => setConfig({ ...config, time_between_measurements: e.target.value })} type="number" step="0.1" min="0" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">¿Cuál es el tiempo de luz? (en minutos):</label>
                                    <input value={config?.time_light} onChange={(e) => setConfig({ ...config, time_light: e.target.value })} name='time_light' type="number" step="0.1" min="0" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">¿Cuál es el tiempo de oscuridad? (en minutos):</label>
                                    <input value={config?.time_dark} onChange={(e) => setConfig({ ...config, time_dark: e.target.value })} name='time_dark' type="number" step="0.1" min="0" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz blanca (0–100):</label>
                                    <input value={config?.light_white} onChange={(e) => setConfig({ ...config, light_white: e.target.value })} name='light_white' type="number" min="0" max="100" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz azul (0–100):</label>
                                    <input value={config?.light_blue} onChange={(e) => setConfig({ ...config, light_blue: e.target.value })} name='light_blue' type="number" min="0" max="100" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz roja (0–100):</label>
                                    <input value={config?.light_red} onChange={(e) => setConfig({ ...config, light_red: e.target.value })} name='light_red' type="number" min="0" max="100" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800" />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"

                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Enviar
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
                        onClick={handleOnExport}
                        className="w-[75%] h-12 rounded
                        bg-white hover:
                                    dark:bg-[#1d1f21] dark:text-white
                                    dark:hover:bg-neutral-700
                                    hover:bg-neutral-200"
                    >
                        Guardar en excel
                    </button>
                </div>
            </div>
        </div >
    );
}

export default ArduinoController;

