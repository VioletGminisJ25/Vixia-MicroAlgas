/**
 * Este archivo contiene un componente React que muestra los botones de control de la aplicación.
 * Los botones tienen diferentes acciones como;
 *  - Apagar el control del arduino, es decir deja de recibir datos y GUARDARLOS en la base de datos
 *  - Tomar una muestra manual, toma una  muestra de forma manual
 *  - Cambiar parámetros, saca un formulario modal para cambiar los parámetros
 *  - Cambiar configuración
 *  - Exportar datos, se exportan por procedimientos
 */


import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Config } from '../interface/Global_Interface';
import Close from "./ui/Close"
import { data } from 'react-router-dom';
import SwitchState from './ui/SwitchState';

interface BotonesEstadosProps {
    isManual: boolean | null;
    isConnected: boolean | null;
    isWake: boolean | null;
    datetime: string | null;
}

const ArduinoController: React.FC<BotonesEstadosProps> = ({ isManual, isWake, datetime, isConnected }) => {
    const [sensorNames, setSensorNames] = useState<string[]>([]);
    const [selectedSensor, setSelectedSensor] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [config, setConfig] = useState<Config>({
        name: '',
        time_between_measurements: '',
        time_light: '',
        time_dark: '',
        light_white: '',
        light_blue: '',
        light_red: ''
    });

    // Se obtienen el nombre de los procedimientos disponibles para exportar a excel, se ejecuta al cargar
    useEffect(() => {
        const fetchSensorNames = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_GET_ALL_NAMES, { method: 'GET' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: string[] = await response.json();
                console.log("sensores", data);
                setSensorNames(data);
                if (data.length > 0) {
                    setSelectedSensor(data[0]);
                }
            } catch (error) {
                console.error("Error al obtener la configuración:", error);
            }
        };

        fetchSensorNames();
    }, []);

    // Se comunica con el servidor para tomar una muestra manual
    const handleTomarMuestra = () => {
        console.log("¡Botón 'Tomar muestra manual' clickeado!");
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

    // Se comunica con el servidor para cambiar el estado de on/off
    const handleOnOff = () => {
        console.log("¡Botón 'Recibir Muestras' clickeado!");

        const boton = document.getElementById('recibirDatos') as HTMLButtonElement | null;
        if (boton) {
            boton.textContent = isWake ? "Apagar" : "Encender";
        }
        fetch(import.meta.env.VITE_WAKE_UP, { method: 'GET' })
            .then()
            .catch()

    };

    //Se rellenan los campos del formulario con la configuración actual del arduino
    const handleRellenarCampos = () => {
        fetch(import.meta.env.VITE_GET_CONFIG, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(response)
                return response.json();
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

    //Se envía el formulario con los cambios de configuración
    const handleOnSubmit = (event: React.FormEvent) => {

        event.preventDefault();
        const white = Number(config?.light_white);
        const blue = Number(config?.light_blue);
        const red = Number(config?.light_red);

        if ((white + blue + red) > 100) {
            toast.warn("La suma total de las luces no puede superar el 100%.");
            return;
        }

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

    //Se exportan los datos del sensor seleccionado
    const handleOnExport = () => {
        const baseUrl = import.meta.env.VITE_SAVE_EXPORT_PROC;
        const urlWithQuery = `${baseUrl}?name=${encodeURIComponent(selectedSensor)}`;

        toast.promise(
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
                    a.download = `Datos-${datetime?.toString().replace(" ", "T")}.xlsx`;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.error("Error al descargar archivo:", error);
                }), {
            pending: 'Descargando datos...',
            success: 'Iniciando descarga...',
            error: 'Algo salio mal...💀'
        })
    }

    return (
        <div className="h-fit w-60 bg-slate-100 dark:bg-[#0f1011] rounded-lg p-4 mt-20">
            <p className="text-black dark:text-white text-xl font-semibold mb-8 text-center">Controles</p>{" "}
    
            <div className="flex flex-col justify-center items-center w-full h-full gap-4">
                <div
                    className={`
    flex flex-row justify-center items-center
    w-[75%] h-12 rounded
    text-black dark:text-white
    bg-white dark:bg-[#1d1f21]
    transition-colors duration-200 ease-in-out
  `}
                >
                    <SwitchState checked={isWake} onChange={handleOnOff} isConnected={isConnected} />
                </div>
                <div
                    className="flex flex-row justify-center items-center w-full
                             text-black dark:text-white"
                >
                    <button
                        id="muestraManual"
                        onClick={handleTomarMuestra}
                        disabled={!isManual}
                        className={`
                                 w-[75%] h-12 rounded
                                 transition-colors duration-200 ease-in-out
                                 ${isManual && isConnected
                                ? `bg-white text-black hover:bg-neutral-200 
                                 dark:bg-[#1d1f21] dark:text-white dark:hover:bg-neutral-700`
                                : `bg-gray-200 text-gray-400 cursor-not-allowed
                                 dark:bg-gray-700 dark:text-gray-500`
                            }
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
                        disabled={!isConnected}
                        onClick={() => {
                            setShowModal(true);
                            handleRellenarCampos();
                        }}
                        className={`
                                 w-[75%] h-12 rounded
                                 transition-colors duration-200 ease-in-out
                                 ${isConnected
                                ? `bg-white text-black hover:bg-neutral-200 
                                 dark:bg-[#1d1f21] dark:text-white dark:hover:bg-neutral-700`
                                : `bg-gray-200 text-gray-400 cursor-not-allowed
                                 dark:bg-gray-700 dark:text-gray-500`
                            }
                               `}
                    >
                        Cambiar parametros
                    </button>
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg w-96 relative">
                            {" "}
                            
                            <div className="flex justify-between items-baseline">
                                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                                    Cambiar parámetros
                                </h2>
                                <Close onClick={() => setShowModal(false)} />{" "}
                              
                            </div>
                            <form
                                className="space-y-4 text-sm text-gray-800 dark:text-white"
                                onSubmit={handleOnSubmit}
                            >
                                <div>
                                    <label className="block mb-1">
                                        ¿Cuál es el nombre de la medida?:
                                    </label>
                                    <input
                                        required
                                        value={config?.name}
                                        name="name"
                                        onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                        type="text"
                                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
                                        placeholder="Nombre de la medida"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">
                                        ¿Cuál es el tiempo entre medidas? (en minutos):
                                    </label>
                                    <input
                                        required
                                        value={config?.time_between_measurements}
                                        name="time_between_measurements"
                                        onChange={(e) =>
                                            setConfig({ ...config, time_between_measurements: e.target.value })
                                        }
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">
                                        ¿Cuál es el tiempo de luz? (en minutos):
                                    </label>
                                    <input
                                        required
                                        value={config?.time_light}
                                        onChange={(e) => setConfig({ ...config, time_light: e.target.value })}
                                        name="time_light"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">
                                        ¿Cuál es el tiempo de oscuridad? (en minutos):
                                    </label>
                                    <input
                                        required
                                        value={config?.time_dark}
                                        onChange={(e) => setConfig({ ...config, time_dark: e.target.value })}
                                        name="time_dark"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz blanca (0–100):</label>
                                    <input
                                        required
                                        value={config?.light_white}
                                        onChange={(e) => setConfig({ ...config, light_white: e.target.value })}
                                        name="light_white"
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz azul (0–100):</label>
                                    <input
                                        required
                                        value={config?.light_blue}
                                        onChange={(e) => setConfig({ ...config, light_blue: e.target.value })}
                                        name="light_blue"
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1">Porcentaje luz roja (0–100):</label>
                                    <input
                                        required
                                        value={config?.light_red}
                                        onChange={(e) => setConfig({ ...config, light_red: e.target.value })}
                                        name="light_red"
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
                                    />
                                </div>

                                <div className="flex justify-center pt-2">
                                    <button
                                        type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div
                    className="flex flex-row justify-center items-center w-[75%] gap-2
                             text-black dark:text-white"
                >
                    <select
                        disabled={!isConnected}
                        value={selectedSensor}
                        onChange={(e) => setSelectedSensor(e.target.value)}
                        id="sensor-select"
                        className={`
                                 w-full h-12 rounded
                                 transition-colors duration-200 ease-in-out
                                 ${isConnected
                                ? `bg-white dark:bg-[#1d1f21] text-black dark:text-white
        border border-gray-300 dark:border-gray-600
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
        px-3 text-sm text-left leading-tight cursor-pointer`
                                : `bg-gray-200 text-gray-400 cursor-not-allowed
                                 dark:bg-gray-700 dark:text-gray-500`
                            }
                               `}
                    >
                        {sensorNames.length > 0 ? (
                            sensorNames.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))
                        ) : (
                            <option value="">Cargando sensores...</option>
                        )}
                    </select>
                    <button
                        onClick={handleOnExport}
                        value={selectedSensor}
                        className={`
                        w-[40%] h-12 rounded
                        flex justify-center items-center
                        transition-colors duration-200 ease-in-out
                        ${isConnected
                                ? `text-white bg-green-700 hover:bg-green-800`
                                : `bg-green-200 text-white cursor-not-allowed
                           dark:bg-green-400 dark:text-black-500`
                            }
                       `}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-download"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ArduinoController;

