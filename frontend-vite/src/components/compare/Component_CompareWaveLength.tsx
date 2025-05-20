import { useState } from 'react';
import type { CompareData } from '../../interface/Global_Interface';
import DatePickerWithData from './Calendar'
import Nivo_ResponsiveLine_compare from './Nivo_ResponsiveLine_compare'
import useWebSocketLastData from '../../hooks/WebSockect_lasData';
import { ToastContainer } from 'react-toastify';
import PanelInfo from './PanelInfo';

/// Componente principal que contiene el selector de fecha
/// la fecha se selecciona en el componente DatePickerWithData y se pasa al componente SelectedData mediante props
/// 'lastCurrentData' es el componente que muestra la fecha más reciente de los datos obtenidos por el WebSocket, en tiempo real
/// Se utiliza el hook useWebSocket_lastData para obtener los datos del WebSocket.

export default function GraficaComparar() {
    // Estado para almacenar los datos seleccionados por el usuario
    const [datos, setDatos] = useState<CompareData | null>(null);
    const { data: datosWebSocket } = useWebSocketLastData(import.meta.env.VITE_API_URL);

    const nivoLineData: CompareData = {
        last_data: datosWebSocket ?? null, // Asumiendo que datosWebSocket tiene la misma estructura que SampleData
        selected_data: datos?.selected_data ?? null,
    };

    return (
        <div className="flex flex-col h-[90%] w-full">
            {/* Selector de fecha */}
            <div className="
        flex justify-center items-center
        h-[10%] w-[80%] mx-[10%] mt-[1%]
        rounded-lg shadow-lg bg-slate-100
        dark:bg-[#0f1011] dark:ring-0 shadow-lg/100
      ">
                <DatePickerWithData setDatos={setDatos} />
            </div>

            {/* Contenedor de gráficas con divisiones laterales */}
            <div className="flex flex-row items-center justify-center h-[80%] w-[90%] mx-auto mt-4 gap-4">
                {/* Panel izquierdo */}

                <PanelInfo sampleData={nivoLineData.selected_data} titulo='Selecionada'></PanelInfo>

                {/* Gráfica central */}
                <div className="flex items-center justify-center h-full w-[60%] bg-white p-4 rounded-lg shadow-md">
                    <Nivo_ResponsiveLine_compare arduino_data={nivoLineData} />
                </div>

                {/* Panel derecho */}

                <PanelInfo sampleData={nivoLineData.last_data} titulo='Ultimos'></PanelInfo>

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
    );
}