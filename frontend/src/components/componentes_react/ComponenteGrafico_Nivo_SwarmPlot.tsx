import React from 'react';
import Nivo_SwarmPlot from "../componentes_react/Nivo_SwarmPlot";
import type { SwarmPlotData } from "../../scripts/data_interface"; 

interface Props {
    swarmPlot_data: SwarmPlotData | undefined; 
}

const ComponenteGrafico_Nivo_SwarmPlot: React.FC<Props> = ({ swarmPlot_data }) => {
    return (
        <div className="h-[800px] w-full">
            {swarmPlot_data && <Nivo_SwarmPlot nivo_data={swarmPlot_data.datos} nivo_data_values={swarmPlot_data.values} />} 
        </div>
    )
}

export default ComponenteGrafico_Nivo_SwarmPlot;