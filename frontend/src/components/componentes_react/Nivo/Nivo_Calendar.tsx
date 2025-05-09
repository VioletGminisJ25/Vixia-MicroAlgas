//Componente de Nivo: https://nivo.rocks/calendar/
import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import type { CalendarData } from "../../../scripts/Global_Interface";

//Tiene una interfaz para los datos
interface Props {
    nivo_data: CalendarData[];
}

//Se le pasa los datos mediantes props, los datos se recibin del servidor
const Nivo_Calendar: React.FC<Props> = ({ nivo_data }) => {

    const yearsToRender = nivo_data.length > 0 ? nivo_data : [{ year: new Date().getFullYear(), values: [] }];

    return (
        <div id='carrusel' className="grid grid-cols-1 gap-4">
            {yearsToRender.map((yearData) => (
                <div key={yearData.year} className="h-[300px]">
                    <ResponsiveCalendar
                        data={yearData.values}
                        from={`${yearData.year}-01-01`}
                        to={`${yearData.year}-01-31`}
                        emptyColor="#eeeeee"
                        colors={['#ff0000', '#f47560', '#00C800', '#f47560', '#ff0000']}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        monthBorderColor="#ffffff"
                        dayBorderWidth={1}
                        dayBorderColor="#ffffff"
                        yearLegendOffset={2}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'row',
                                translateY: 36,
                                itemCount: 4,
                                itemWidth: 42,
                                itemHeight: 36,
                                itemsSpacing: 14,
                                itemDirection: 'right-to-left'
                            }
                        ]}
                    />
                </div>
            ))}
        </div>
    );
};

export default Nivo_Calendar;