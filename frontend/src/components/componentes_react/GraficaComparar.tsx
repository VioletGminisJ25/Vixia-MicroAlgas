import { useState } from 'react';
import DatePickerWithData from './SelectorFecha';
import LastCurrentData from './ComponenteGrafico_Nivo_LongitudDeOnda';
import SelectedData from './ComponenteGrafico_Nivo_LongitudDeOnda';
import type { CompareData } from "../../scripts/data_interface";
import { motion } from 'framer-motion';

const appearVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }
  }
};

export default function ParentComponent() {
  const [datos, setDatos] = useState<CompareData | null>(null);

  return (
    <div className="flex flex-col h-full">
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
        {/* Bloque 1 */}
        <motion.div
          id="graficaAnimacion"
          className="flex-1 h-[90%] mx-2"
          variants={appearVariants}
          initial="hidden"
          animate="visible"
        >
          <SelectedData
            titulo="FECHA SELECIONADA"
            datos={datos?.selected_data ?? null}
          />
        </motion.div>

        {/* Bloque 2 */}
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
            datos={datos?.last_data ?? null}
          />
        </motion.div>
      </div>
    </div>


  );
}