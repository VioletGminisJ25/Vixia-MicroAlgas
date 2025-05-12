import { useState } from 'react';
import DatePickerWithData from '../Ui/SelectorFecha';
import LastCurrentData from '../Nivo/ComponenteGrafico_Nivo_LongitudDeOnda';
import SelectedData from '../Nivo/ComponenteGrafico_Nivo_LongitudDeOnda';
import type { CompareData } from "../../../scripts/Global_Interface";
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import useWebSocket_lastData from '../../../hooks/WebSockect_lasData';

// Propiedades de las animaciones de carga de los componentes.
const appearVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }
  }
};

/// Componente principal que contiene el selector de fecha
/// la fecha se selecciona en el componente DatePickerWithData y se pasa al componente SelectedData mediante props
/// 'lastCurrentData' es el componente que muestra la fecha más reciente de los datos obtenidos por el WebSocket, en tiempo real
/// Se utiliza el hook useWebSocket_lastData para obtener los datos del WebSocket.

export default function GraficaComparar() {
  // Estado para almacenar los datos seleccionados por el usuario
  const [datos, setDatos] = useState<CompareData | null>(null);
  const { data: datosWebSocket, isConnected, error, lights_state } = useWebSocket_lastData(import.meta.env.PUBLIC_API_URL);

  return (
    <div className="flex flex-col h-[90%]">
      {/* Selector de fecha */}
      <div className="
      flex justify-center items-center
      h-[10%] w-[80%] mx-[10%] mt-[1%]
      rounded-lg shadow-lg bg-slate-100
      dark:bg-[#0f1011] dark:ring-0 shadow-lg/100
    ">
        <DatePickerWithData setDatos={setDatos} />
      </div>

      {/* Contenedor de gráficas */}
      <div className="flex flex-1 justify-between items-center gap-x-4 px-4 py-2">

        {/* Bloque 'selected_data' */}
        <motion.div
          id="graficaAnimacion"
          className="flex-1 h-[90%] mx-2"
          variants={appearVariants}
          initial="hidden"
          animate="visible"
        >
          <SelectedData
            titulo="FECHA SELECIONADA"
            datos={datos?.selected_data ?? null} lights={null}
          />
        </motion.div>

        {/* Bloque 'lastcurrentdata' */}
        <motion.div
          id="graficaAnimacion2"
          className="flex-1 h-[90%] mx-2"
          variants={appearVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <LastCurrentData
            titulo="FECHA MAS RECIENTE"
            datos={datosWebSocket ?? null} 
            lights={lights_state ?? null}
          />
        </motion.div>
      </div>

      {/* Contenedor de notificaciones, con estilos unicos, las 'Toastify' son enviadas mediante el websocket */}
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