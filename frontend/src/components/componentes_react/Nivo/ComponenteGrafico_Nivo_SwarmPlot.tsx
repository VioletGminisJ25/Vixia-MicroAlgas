import React from 'react';
import Nivo_SwarmPlot from "./Nivo_SwarmPlot";
import type { SwarmPlotData } from "../../../scripts/Global_Interface"; 

interface Props {
    swarmPlot_data: SwarmPlotData | undefined; 
}

const ComponenteGrafico_Nivo_SwarmPlot: React.FC<Props> = ({ swarmPlot_data }) => {
    return (
        <div className="h-[800px] w-full">
            {swarmPlot_data && <Nivo_SwarmPlot nivo_data={swarmPlot_data.datos} nivo_data_values={swarmPlot_data.values} nivo_data_names={swarmPlot_data.ID} />} 
        </div>
    )
}

export default ComponenteGrafico_Nivo_SwarmPlot;