import React from 'react';
import Nivo_Calendar from "./Nivo_Calendar";
import type { CalendarData } from "../../../scripts/Global_Interface"; // Importa la interfaz

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