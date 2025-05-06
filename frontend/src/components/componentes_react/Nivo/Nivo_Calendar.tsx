import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import type { CalendarData } from "../../../scripts/Global_Interface"; // Importa la interfaz
import { scaleLinear } from 'd3-scale';

interface Props {
    nivo_data: CalendarData[];
}

const Nivo_Calendar: React.FC<Props> = ({ nivo_data }) => {
    console.log("Nivo_Calendar", nivo_data); // Log para depuración

    const yearsToRender = nivo_data.length > 0 ? nivo_data : [{ year: new Date().getFullYear(), values: [] }];

    return (
        <div className="grid grid-cols-1 gap-4"> {/* Force one column */}
            {yearsToRender.map((yearData) => (
                <div key={yearData.year} className="h-[300px]">
                    <ResponsiveCalendar
                        data={yearData.values} // Cambia esto para usar los datos de cada año
                        from={`${yearData.year}-01-01`}
                        to={`${yearData.year}-12-31`}
                        emptyColor="#eeeeee"
                        colors={['#ff0000', '#f47560','#00C800', '#f47560', '#ff0000']}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        monthBorderColor="#ffffff"
                        dayBorderWidth={1}
                        dayBorderColor="#ffffff"
                        legends={[]}
                    />
                </div>
            ))}
        </div>
    );
};

export default Nivo_Calendar;