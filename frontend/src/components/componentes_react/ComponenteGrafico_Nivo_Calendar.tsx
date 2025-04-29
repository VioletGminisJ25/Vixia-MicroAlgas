import React from 'react';
import Nivo_Calendar from "../componentes_react/Nivo_Calendar";
import type { CalendarData } from "../../scripts/data_interface"; // Importa la interfaz

interface Props {
    calendar_data: CalendarData[];
}

const ComponenteGrafico_Nivo_Calendar: React.FC<Props> = ({ calendar_data }) => {
    return (
       
    <div>
        <Nivo_Calendar nivo_data={calendar_data} />
    </div>
    )
}

export default ComponenteGrafico_Nivo_Calendar;