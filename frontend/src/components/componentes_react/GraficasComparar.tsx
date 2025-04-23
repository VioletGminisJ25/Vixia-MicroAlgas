import { useState } from 'react';
import DatePickerWithData from './SelectorFecha';
import LastCurrentData from './Grafico';
import SelectedData from './Grafico';
import type { CompareData } from "../../scripts/data_interface";



export default function ParentComponent() {
  const [datos, setDatos] = useState<CompareData | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="
   flex justify-center items-center h-[10%] w-[80%] mx-[10%] mt-[1%] rounded-lg shadow-lg
   bg-gray-100 dark:bg-[#0f1011] dark:ring-0 shadow-lg/100
 ">
        <DatePickerWithData setDatos={setDatos} />
      </div>

      <div className="
   flex flex-1 justify-around
   items-center 
    ">
        <SelectedData titulo='FECHA SELECIONADA' datos={datos?.selected_data ?? null} />
        <LastCurrentData titulo='FECHA MAS RECIENTE' datos={datos?.last_data ?? null} />
      </div>
    </div>
  );
}
