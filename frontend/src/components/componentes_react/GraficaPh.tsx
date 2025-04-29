import React, { useState, useEffect } from 'react';
import CalendarByYear from "../componentes_react/ComponenteGrafico_Nivo_Calendar";
import Swarmplot from "../componentes_react/ComponenteGrafico_Nivo_SwarmPlot";
import NivoLineChart from "./ComponenteGrafico_Responsive_Line"; // Importa el componente correcto
import type { PhInterface } from '../../scripts/data_interface';
import Loader from "../componentes_react/Loader";

// Ejemplo de cómo podrías recibir los datos del backend

export default function GraficaPh() {
  const [jsonData, setJsonData] = useState<PhInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://193.146.35.170:5000/ph', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PhInterface = await response.json();
        console.log("JSON recibido del backend (POST):", data);

        setJsonData(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching data (POST):", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[90%] p-6 grid grid-cols-5 grid-rows-5 gap-4">

      <div id='padre_grafica' className="min-h-[100%] shadow-md h-fit rounded-lg  p-4 col-span-3 row-span-3 bg-slate-100">
        <h2 className="text-xl font-semibold mb-4">Grafica</h2>
        <div id='grafica' className='min-h-[80%] w-full h-full flex items-center justify-center bg-white rounded-lg'>
          {loading ? (
            <Loader />
          ) : (
            <NivoLineChart lineData={jsonData?.ResponsiveLine || []} />
          )}
        </div>
      </div>

      <div id='padre_swarmPlot' className="min-h-[100%] shadow-md rounded-lg p-4 h-fit col-span-2 row-span-5 col-start-4 row-start-1 bg-slate-100">
        <h2 className="text-xl font-semibold mb-4">SwarmPlot</h2>
        <div id='swarmplot' className='w-full flex items-center justify-center bg-white rounded-lg'>
          {loading ? (
            <Loader />
          ) : (
            <Swarmplot swarmPlot_data={jsonData?.SwarmPlot} />
          )}
        </div>
      </div>

      <div id='padre_Calendar' className="min-h-[100%] shadow-md rounded-lg  p-4 h-fit col-span-3 row-span-2 col-start-1 row-start-4 bg-slate-100">
        <h2 className="text-xl font-semibold mb-4">Calendario</h2>
          {loading ? (
            <Loader />
          ) : (
            <CalendarByYear calendar_data={jsonData?.Calendar || []} />
          )}
            <div id='calendar' className='w-full h-full flex items-center justify-center bg-white rounded-lg'>
        </div>
      </div>

      {/* <div className="shadow-md rounded-lg bg-white p-4 h-fit">
        <h2 className="text-xl font-semibold mb-4">nosé</h2>
      </div> */}
    </div>
  );
}
