import ComponenteGrafico from '../components/index/Component_WaveLength'
import ArduinoController from '../components/index/ArduinoController'
import { ToastContainer } from 'react-toastify';
import Nivo_ResponsiveLine from '../components/index/Nivo_ResponsiveLine_Index';
import PanelInfo from '../components/compare/PanelInfo';
import Calendar from '../components/compare/Calendar';

import WebSocket from '../hooks/WebSockect_lasData'
export default function GraficoLongitudDeOndaPage() {
    const { data, isManual, isWake } = WebSocket(import.meta.env.VITE_API_URL)

    return (
        <div className="flex flex-row justify-center items-center h-[80%] w-[100%] mx-auto mt-8 gap-4">
            {/* Panel izquierdo */}

            <PanelInfo sampleData={data} titulo='Ultimos Datos'></PanelInfo>

            {/* Gráfica central */}
            <div className="flex items-center justify-center h-[80%] w-[60%] bg-white p-4 rounded-lg shadow-md mr-10 ml-10">
                <Nivo_ResponsiveLine arduino_data={data} />
            </div>

            <div className="w-[15%] flex justify-end items-center h-[50%]">
                <ArduinoController isManual={isManual} isWake={isWake} />
            </div>
            {/* Panel derecho */}


        </div>
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
