import ArduinoController from '../components/index/ArduinoController'
import PanelInfo from '../components/compare/PanelInfo';
import Nivo_ResponsiveLine from '../components/index/Nivo_ResponsiveLine_Index';
import { ToastContainer } from 'react-toastify';

import WebSocket from '../hooks/WebSockect_lasData'
import { useState, useEffect } from 'react';

export default function GraficoLongitudDeOndaPage() {
    const { data, isManual, isWake, lightsState } = WebSocket(import.meta.env.VITE_API_URL)
    const [name, setName] = useState<string>('')

    useEffect(() => {
        fetch(import.meta.env.VITE_GET_NAME, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("nombre de la medida", data);
                setName(data);
            })
            .catch(error => {
                console.log(data);
                console.error("Error al obtener la configuración:", error);
            });
    }, [])

    return (
        <div className="h-[90%] w-full flex flex-row items-center justify-center">
            <div className="flex flex-col items-center h-[90%] w-full ">

                <div className="
        flex justify-center items-center h-[10%] w-[60%] mx-auto rounded-lg shadow-lg bg-slate-100 dark:bg-[#0f1011] dark:ring-0 shadow-lg/100">
                    <div className='h-full w-full flex flex-row justify-start items-center gap-2.5 p-8'>
                        <button
                            id="red"
                            disabled={lightsState?.roja}
                            className={`min-w-[120px] h-12 rounded 
            ${lightsState?.roja ? 'bg-red-500 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                            title={lightsState?.roja ? 'Se uso' : 'No se uso'}>
                            Rojo
                        </button>

                        <button
                            id="white"
                            disabled={lightsState?.blanca}
                            className={`min-w-[120px] h-12 rounded 
            ${lightsState?.blanca ? 'bg-white text-black' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                            title={lightsState?.blanca ? 'Se uso' : 'No se uso'}>
                            Blanco
                        </button>

                        <button
                            id="blue"
                            disabled={lightsState?.azul}
                            className={`min-w-[120px] h-12 rounded 
            ${lightsState?.azul ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                            title={lightsState?.azul ? 'Se uso' : 'No se uso'}
                        >
                            Azul
                        </button>
                    </div>
                    <div className='h-full w-full flex flex-row justify-end items-center gap-2.5 p-8'>
                        <p className='text-black dark:text-white'>{name ?? 'Sin nombre'}</p>
                    </div>
                </div>

                <div className="flex flex-row justify-center h-[80%] w-[100%] mx-auto mt-4 gap-4">
                    <PanelInfo sampleData={data} titulo='Ultimos Datos'></PanelInfo>
                    <div className="flex items-center justify-center h-full w-[60%] bg-white p-4 rounded-lg shadow-md mr-10 ml-10">
                        <Nivo_ResponsiveLine arduino_data={data} />
                    </div>
                    <ArduinoController isManual={isManual} isWake={isWake} datetime={data?.datetime ?? null} />
                </div>

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
        </div >
    );
}
