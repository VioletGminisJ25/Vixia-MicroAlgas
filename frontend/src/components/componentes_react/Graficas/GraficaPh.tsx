import React, { useState, useEffect } from 'react';
import CalendarByYear from "../Nivo/ComponenteGrafico_Nivo_Calendar";
import Swarmplot from "../Nivo/ComponenteGrafico_Nivo_SwarmPlot";
import NivoLineChart from "../Nivo/ComponenteGrafico_Responsive_Line";
import type { Interface_Ph_Temp } from '../../../scripts/Global_Interface';
import Loader from "../Ui/Loader";
import ErrorC from "../Ui/ServerError";
import { ToastContainer, toast } from 'react-toastify'

// Aqui se podra visualizar los datos del ph
// Hay 3 graficas, un calendario, un swarmplot y una grafica de lineas
// El calendario es la media diaria de ph, ademas de poder selecionar el año que se quiere ver.
// segun la intensidad del color, y el mismo color el dato sera mas alto o mas bajo
//El grafico de lineas muestra el dato mas alto y el mas bajo de cada semana del año.
// El swarmplot muestra los grupos de datos y las ocurrencias de cada uno de ellos
export default function Grafica() {
  //Aqui se guardan los estados de los componentes, para el manejo de carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Aqui se guardan los datos que se reciben del backend.
  const [jsonData, setJsonData] = useState<Interface_Ph_Temp | null>(null);

  //useEffect para la carga de datos, se ejecuta al iniciar el componente
  // Se hace una peticion al backend para obtener los datos de las graficas
  //Por defecto loading es true, y se cambia a false cuando se finaliza la conexion, sin importar si ha sido correcta o no.
  // Si hay un error se guarda el estado, tal vez si se quiera mostrar un mensaje de error
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Aqui se hace la peticion al backend, se le pasa el metodo y el header de la peticion
        const response = await fetch(import.meta.env.PUBLIC_GET_HP, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Interface_Ph_Temp = await response.json();
        console.log("JSON recibido del backend (POST):", data);

        // Si la respuesta es correcta, se guardan los datos en el estado
        setJsonData(data);
        toast.success('Datos obtenidos', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
        });
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching data (POST):", e);
        toast.error("Error de conexión", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Bloque react con la carga de cada grafica, por ahora tiene encuenta que esta cargando, pero no si hay error. 
  //Para la carga se usa UI de carga, al terminiar se muestra la grafica
  return (
    <div className="w-full h-[90%] p-6 grid grid-cols-5 grid-rows-5 gap-4">

      <div id='padre_grafica' className="min-h-[100%] shadow-md h-fit rounded-lg  p-4 col-span-3 row-span-3 bg-slate-100">
        <h2 className="text-xl font-semibold mb-4">Grafica</h2>
        <div id='grafica' className='min-h-[380px] w-full h-full flex items-center justify-center bg-white rounded-lg'>
          {loading ? (
            <Loader />
          ) : (
            <NivoLineChart lineData={jsonData?.ResponsiveLine || []} />
          )}
        </div>
      </div>

      <div id='padre_swarmPlot' className="min-h-[100%] shadow-md rounded-lg p-4 h-fit col-span-2 row-span-5 col-start-4 row-start-1 bg-slate-100">
        <h2 className="text-xl font-semibold mb-4">SwarmPlot</h2>
        <div id='swarmplot' className='min-h-[710px] w-full flex items-center justify-center bg-white rounded-lg'>
          {loading ? (
            <Loader />
          ) : (
            <Swarmplot swarmPlot_data={jsonData?.SwarmPlot} />
          )}
        </div>
      </div>

      <div id='padre_Calendar' className="min-h-[100%] shadow-md rounded-lg  p-4 h-fit col-span-3 row-span-2 col-start-1 row-start-4 bg-slate-100 ">
        <h2 className="text-xl font-semibold mb-4">Calendario</h2>
        <div id='calendar' className='w-full h-[100%] flex items-center justify-center bg-white rounded-lg'>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <CalendarByYear calendar_data={jsonData?.Calendar || []} />
        )}
      </div>

      {/* <div className="shadow-md rounded-lg bg-white p-4 h-fit">
        <h2 className="text-xl font-semibold mb-4">nosé</h2>
      </div> */}
    </div>
  );
}
