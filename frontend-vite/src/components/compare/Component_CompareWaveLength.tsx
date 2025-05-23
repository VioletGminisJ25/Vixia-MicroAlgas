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
    const [data, setData] = useState<string | null>(null);
    const { data: datosWebSocket } = useWebSocketLastData(import.meta.env.VITE_API_URL);

    const nivoLineData: CompareData = {
        last_data: datosWebSocket ?? null, // Asumiendo que datosWebSocket tiene la misma estructura que SampleData
        selected_data: datos?.selected_data ?? null,
    };

    const handleOnExport = () => {
        // Construye la URL con el query parameter
        // Asumo que tu VITE_SAVE_EXPORT es algo como "http://localhost:5000/api/save_export"
        const baseUrl = import.meta.env.VITE_SAVE_EXPORT;
        const urlWithQuery = `${baseUrl}?fecha=${data}`; // Añade ?parametro=valor
        console.log(urlWithQuery);
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


    return (
        <div className="flex flex-col items-center h-[90%] w-full relative"> {/* Añadido relative para el posicionamiento absoluto si lo quisieras flotante */}
            {/* Selector de fecha */}
            <div className="
                flex justify-center items-center h-[10%] w-[60%] rounded-lg shadow-lg bg-slate-100 dark:bg-[#0f1011] dark:ring-0 shadow-lg/100">
                <DatePickerWithData setDatos={setDatos} setData={setData} />
            </div>



            {/* Contenedor de gráficas con divisiones laterales */}
            <div className="flex flex-row justify-center h-[80%] w-[100%] mx-auto mt-4 gap-4">
                {/* Panel izquierdo */}
                <PanelInfo sampleData={nivoLineData.last_data} titulo="Últimos Datos" />

                {/* Gráfica central */}
                <div className="flex items-center justify-center h-full w-[60%] bg-white p-4 rounded-lg shadow-md mr-10 ml-10">
                    <Nivo_ResponsiveLine_compare arduino_data={nivoLineData} />
                </div>

                {/* Panel derecho con botón debajo */}
                <div className="flex flex-col items-center gap-4">
                    <PanelInfo sampleData={nivoLineData.selected_data} titulo="Datos Seleccionados" />
                    <button
                        id='muestraManual'
                        onClick={handleOnExport}
                        className={`
                            w-[65%] h-10 rounded text-white bg-green-700 hover:bg-green-800`}
                    >
                        Guardar en Excel
                    </button>
                </div>
            </div>


            {/* Contenedor de notificaciones */}
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