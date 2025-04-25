import React from 'react';
import Nivo_SwarmPlot from "../componentes_react/Nivo_SwarmPlot";
import type { SwarmplotData } from "../../scripts/data_interface"; // Importa la interfaz

interface Props {
    swarmPlot_data: SwarmplotData[];
}

const ComponenteGrafico_Nivo_SwarmPlot: React.FC<Props> = ({ swarmPlot_data }) => {
    return (<div>
        <Nivo_SwarmPlot nivo_data={swarmPlot_data} />
    </div>
    )
}

export default ComponenteGrafico_Nivo_SwarmPlot;