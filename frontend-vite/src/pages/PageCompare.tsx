import { useState } from 'react';
import type { CompareData, LightsState, SampleData } from '../interface/Global_Interface';
import DatePickerWithData from '../components/compare/Calendar'
import Nivo_ResponsiveLine_compare from '../components/compare/Nivo_ResponsiveLine_compare'
import useWebSocketLastData from '../hooks/WebSockect_lasData';
import { toast, ToastContainer } from 'react-toastify';
import PanelInfo from '../components/compare/PanelInfo';

/// Componente principal que contiene el selector de fecha
/// la fecha se selecciona en el componente DatePickerWithData y se pasa al componente SelectedData mediante props
/// 'lastCurrentData' es el componente que muestra la fecha más reciente de los datos obtenidos por el WebSocket, en tiempo real
/// Se utiliza el hook useWebSocket_lastData para obtener los datos del WebSocket.
interface ComprareProps {
    datosWebSocket: SampleData | null;
    isConnected: boolean;
}
export default function GraficaComparar({ datosWebSocket, isConnected }: ComprareProps) {
    // Estado para almacenar los datos seleccionados por el usuario
    const [datos, setDatos] = useState<CompareData | null>(null);
    const [data, setData] = useState<string | null>(null);


    const nivoLineData: CompareData = {
        last_data: datosWebSocket ?? null, // Asumiendo que datosWebSocket tiene la misma estructura que SampleData
        selected_data: datos?.selected_data ?? null,
    };

    const handleOnExportaSelect = () => {
        // Construye la URL con el query parameter
        // Asumo que tu VITE_SAVE_EXPORT es algo como "http://localhost:5000/api/save_export"
        const baseUrl = import.meta.env.VITE_SAVE_EXPORT;
        const urlWithQuery = `${baseUrl}?fecha=${encodeURIComponent(data ?? "")}`; // Añade ?parametro=valor
        console.log(urlWithQuery);

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
                    a.download = `Datos-${datos?.selected_data?.datetime?.toString().replace(" ", "T")}.xlsx`;  // 👈 Aquí puedes cambiar el nombre si quieres
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();  // 👈 Esto abre la ventana de guardar
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

    const handleOnExportLast = () => {
        console.log("exportando ultimos datos");
        const now = new Date();

        // Formato YYYY-MM-DDTHH:mm:ss en hora local
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const encodedDate = encodeURIComponent(formattedDate);
        const baseUrl = import.meta.env.VITE_SAVE_EXPORT;
        const urlWithQuery = `${baseUrl}?fecha=${encodedDate}`;

        console.log("->" + urlWithQuery);
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
                    a.download = `Datos-${datosWebSocket?.datetime?.toString().replace(" ", "T")}.xlsx`;
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
        <div className="h-[90%] w-full flex flex-row items-center justify-center">
            <div className="flex flex-col items-center h-[90%] w-full ">
                {/* Selector de fecha */}
                <div className="
                flex justify-center items-center h-[10%] w-[60%] rounded-lg shadow-lg bg-slate-100 dark:bg-[#0f1011] dark:ring-0 shadow-lg/100">
                    <DatePickerWithData setDatos={setDatos} setData={setData} />
                </div>



                {/* Contenedor de gráficas con divisiones laterales */}
                <div className="flex flex-row justify-center h-[80%] w-[100%] mx-auto mt-4 gap-4">

                    {/* Panel izquierdo */}
                    <div className="flex flex-col items-center gap-4">
                        <PanelInfo sampleData={nivoLineData.last_data} titulo="Últimos Datos" />

                        <button
                            id='takeLast'
                            onClick={handleOnExportLast}
                            disabled={!isConnected}
                            className={`px-4 py-2 rounded transition
    ${isConnected ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                        >
                            Guardar en Excel
                        </button>

                    </div>

                    {/* Gráfica central */}
                    <div className="flex items-center justify-center h-full w-[60%] bg-white p-4 rounded-lg shadow-md mr-10 ml-10">
                        <Nivo_ResponsiveLine_compare arduino_data={nivoLineData} />
                    </div>

                    {/* Panel derecho con botón debajo */}
                    <div className="flex flex-col items-center gap-4">
                        <PanelInfo sampleData={nivoLineData.selected_data} titulo="Datos Seleccionados" />
                        {nivoLineData.selected_data?.datetime && (
                            <button
                                id='takeSelected'
                                onClick={handleOnExportaSelect}
                                disabled={!isConnected}
                                className={`px-4 py-2 rounded transition
    ${isConnected ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}

                            >
                                Guardar en Excel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}