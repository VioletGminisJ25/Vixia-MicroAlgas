import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import NivoLine2 from '../components/nivo/Nivo_ResponsiveLine_Sensores2';
import ScatterPlot from '../components/nivo/Nivo_ScatterPlot';
import type { SensorData, NivoLineData, Sensor } from '../interface/Global_Interface';

export default function PageSensores() {
    const [sensorNames, setSensorNames] = useState<string[]>([]);
    const [selectedSensor, setSelectedSensor] = useState<string>('');
    const [ncTime, setNcTime] = useState<NivoLineData | null>(null);
    const [ncValue, setNcValue] = useState<NivoLineData | null>(null);
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
        <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#1D1F21] text-gray-900 p-6 sm:p-8 md:p-10 flex flex-col items-center">
            {/* Sensor Selector */}
            <div className="mb-10 p-4 bg-white dark:bg-[#0F1011] rounded-lg shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <label htmlFor="sensor-select" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Selecciona un sensor:
                </label>
                <div className="relative">
                    <select
                        id="sensor-select"
                        value={selectedSensor}
                        onChange={handleSensorChange}
                        className=" bg-white dark:bg-[#1d1f21] text-black dark:text-white border dark:border-white border-black rounded px-2 py-2 text-sm text-center"
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


                </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full p-4">
                <div className='h-[400px] bg-slate-100 rounded-lg'>{ncValue && <ScatterPlot data={ncValue} />}</div>
                <div className='h-[400px] bg-slate-100 rounded-lg'> {ncTime && <NivoLine2 data={ncTime} />}</div>
                <div className='h-[400px] bg-slate-100 rounded-lg'> {sensor && <NivoLine2 data={sensor[0]} />}</div>
                <div className='h-[400px] bg-slate-100 rounded-lg'> {sensor && <NivoLine2 data={sensor[1]} />}</div>
            </div>
        </div >
    );
}