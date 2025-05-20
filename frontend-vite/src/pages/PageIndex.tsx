import ComponenteGrafico from '../components/index/Component_WaveLength'
import ArduinoController from '../components/index/ArduinoController'
import { ToastContainer } from 'react-toastify';

import WebSocket from '../hooks/WebSockect_lasData'
export default function GraficoLongitudDeOndaPage() {
    const { data, isManual, isWake } = WebSocket(import.meta.env.VITE_API_URL)

    return (
        <div className="h-[90%] w-full flex flex-row items-center justify-center">
            {/* Contenedor para la gráfica: ocupará el 75% del ancho y estará centrado */}
            <div className="w-[75%] flex justify-center items-center h-full">
                <ComponenteGrafico datos={data} />
            </div>

            {/* Contenedor para los botones de Arduino: ocupará el 25% del ancho y será más alto */}
            <div className="w-[15%] flex justify-end items-center h-[50%]"> {/* Ajusta h-[90%] para que sea más alto */}
                <ArduinoController isManual={isManual} isWake={isWake} />
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
                theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'dark'}
            />
        </div>
    );
}
