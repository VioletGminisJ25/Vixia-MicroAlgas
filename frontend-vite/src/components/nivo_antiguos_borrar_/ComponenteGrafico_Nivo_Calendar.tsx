//Contenedor del componente Nivo_Calendar
import React from 'react';
import Nivo_Calendar from "./Nivo_Calendar";
import type { CalendarData } from "../../interface/Global_Interface";

//Aqui se gestionada una cosa
//Si hay mas de un año, se puede selecionar el año con un boton
//De esta forma se cargan los datos en un calendario y por año, así no renderizamos varios calendarios (uno por año)
function ComponenteGrafico_Nivo_Calendar({ calendar_data }: { calendar_data: CalendarData[] }) {
    const [selectedYear, setSelectedYear] = React.useState<number | null>(
        calendar_data.length > 0 ? calendar_data[0].year : null
    );

    const years = calendar_data.map((d) => d.year);

    const dataForYear = calendar_data.find((d) => d.year === selectedYear)?.values ?? [];

    return (
        <div>
            {/* Boton de cada año */}
            <div className="flex space-x-2 mb-4 overscroll-auto h-full w-full">
                {years.map((year) => (
                    <button
                        key={year}
                        className={`px-3 py-1 rounded ${year === selectedYear ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}
                        onClick={() => setSelectedYear(year)}
                    >
                        {year}
                    </button>

                ))}
            </div>

            {/* Calendario del año selecionado*/}
            {selectedYear !== null && (
                <Nivo_Calendar nivo_data={[{ year: selectedYear, values: dataForYear }]} />
            )}
        </div>
    );
}
export default ComponenteGrafico_Nivo_Calendar;

