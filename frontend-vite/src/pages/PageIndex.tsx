import ArduinoController from '../components/index/ArduinoController'
import PanelInfo from '../components/compare/PanelInfo';
import Nivo_ResponsiveLine from '../components/index/Nivo_ResponsiveLine_Index';
import { ToastContainer } from 'react-toastify';

interface Componente1Props {
    lights: { roja: number; blanca: number; azul: number } | null;
}

import WebSocket from '../hooks/WebSockect_lasData'
export default function GraficoLongitudDeOndaPage() {
    const { data, isManual, isWake, lightsState } = WebSocket(import.meta.env.VITE_API_URL)
    const colors = { roja: 0, blanca: 0, azul: 0 };
    return (
        <div className="h-[90%] w-full flex flex-row items-center justify-center">
            <div className="flex flex-col items-center h-[90%] w-full ">
                {/* Selector de fecha */}

                <div className="
        flex justify-center items-center h-[10%] w-[60%] mx-auto rounded-lg shadow-lg bg-slate-100 dark:bg-[#0f1011] dark:ring-0 shadow-lg/100">
                    <div className='h-full w-full flex flex-row justify-start items-center gap-2.5 p-8'>
                        <button
                            id="red"
                            disabled={true}
                            className={`min-w-[120px] h-12 rounded 
            ${colors.roja ? 'bg-red-500 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                            title={colors?.roja ? 'Se uso' : 'No se uso'}>
                            Rojo
                        </button>

                        <button
                            id="white"
                            disabled={true}
                            className={`min-w-[120px] h-12 rounded 
            ${colors.blanca ? 'bg-white text-black' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                            title={colors?.blanca ? 'Se uso' : 'No se uso'}>
                            Blanco
                        </button>

                        <button
                            id="blue"
                            disabled={!colors.azul}
                            className={`min-w-[120px] h-12 rounded 
            ${colors.azul ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                            title={colors?.azul ? 'Se uso' : 'No se uso'}
                        >
                            Azul
                        </button>
                    </div>
                    <div className='h-full w-full flex flex-row justify-end items-center gap-2.5 p-8'>
                        <p className='text-black dark:text-white'>Titulo extramedamente largo y complejo</p>
                    </div>
                </div>

                {/* Contenedor de gráficas con divisiones laterales */}
                <div className="flex flex-row justify-center h-[80%] w-[100%] mx-auto mt-4 gap-4">
                    <PanelInfo sampleData={data} titulo='Ultimos Datos'></PanelInfo>
                    <div className="flex items-center justify-center h-full w-[60%] bg-white p-4 rounded-lg shadow-md mr-10 ml-10">
                        <Nivo_ResponsiveLine arduino_data={data} />
                    </div>
                    <ArduinoController isManual={isManual} isWake={isWake} />
                </div>

                {/* Contenedor de notificaciones, con estilos únicos, las 'Toastify' son enviadas mediante el websocket */}
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
        // <div className="h-[90%] w-full flex flex-row items-center justify-center">

        //     <div className="w-[75%] flex justify-center items-center h-full">
        //         <ComponenteGrafico datos={data} />
        //     </div>


        //     <div className="w-[15%] flex justify-end items-center h-[50%]">
        //         <ArduinoController isManual={isManual} isWake={isWake} />
        //     </div>

        //     <ToastContainer
        //         position="bottom-right"
        //         autoClose={2000}
        //         limit={3}
        //         hideProgressBar={false}
        //         newestOnTop={true}
        //         closeOnClick={false}
        //         rtl={false}
        //         pauseOnFocusLoss
        //         draggable
        //         pauseOnHover
        //         theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'dark'}
        //     />
        // </div>
    );
}
