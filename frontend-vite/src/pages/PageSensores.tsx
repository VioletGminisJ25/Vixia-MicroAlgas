import { useEffect, useState } from 'react';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import toastify styles
import NivoLine from '../components/sensores/Nivo_ResponsiveLine_Sensores';
import NivoLine2 from '../components/sensores/Nivo_ResponsiveLine_Sensores2';
import ScatterPlot from '../components/sensores/Nivo_ScatterPlot';
import type { SensorData, NivoLineData, Sensor } from '../interface/Global_Interface';

export default function PageSensores() {
    const [sensorNames, setSensorNames] = useState<string[]>([]);
    const [selectedSensor, setSelectedSensor] = useState<string>('');
    const [ncTime, setNcTime] = useState<NivoLineData | null>(null); // Initialize with null
    const [ncValue, setNcValue] = useState<NivoLineData | null>(null); // Initialize with null
    const [sensor, setsensor] = useState<Sensor | null>(null);

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
                    await handleSensorChange({ target: { value: data[0] } } as React.ChangeEvent<HTMLSelectElement>);
                }
            } catch (error) {
                console.error("Error al obtener la configuración:", error);
            }
        };

        fetchSensorNames();
    }, []);

    const handleSensorChange = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const name: string = event.target.value;
        setSelectedSensor(name);
        try {
            const response: Response = await fetch(`${import.meta.env.VITE_PROC_NAME}?name=${name}`, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const info_back: SensorData = await response.json();
            console.log(`Data from backend for ${name}:`, info_back);

            setNcValue(info_back.nc_value);
            setNcTime(info_back.nc_time);
            setsensor(info_back.sensors);
            // The console.log here will still show the previous state value due to closure.
            // The actual state will be updated for the next render.
        } catch (error) {
            console.error(`Error fetching data for ${name}:`, error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 sm:p-8 md:p-10 flex flex-col items-center">
            {/* Page Title */}
            <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700 dark:text-blue-400">
                Dashboard de Sensores
            </h1>

            {/* Sensor Selector */}
            <div className="mb-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <label htmlFor="sensor-select" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Selecciona un sensor:
                </label>
                <div className="relative">
                    <select
                        id="sensor-select"
                        value={selectedSensor}
                        onChange={handleSensorChange}
                        className="block appearance-none w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out cursor-pointer text-base"
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {ncValue && <ScatterPlot data={ncValue} />}


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
        </div >
    );
}