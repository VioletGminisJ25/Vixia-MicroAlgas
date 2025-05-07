//Contenedor del componente Nivo_ResponsiveLine
import React from 'react';
import Nivo_NivoLine from "./Nivo_ResponsiveLine";
import type { NivoLineData } from "../../../scripts/Global_Interface";

interface Props {
    lineData: NivoLineData[];
}

const ComponenteGrafico_Nivo_Line: React.FC<Props> = ({ lineData }) => {
    return (
        <div className="h-full w-full ">
            <Nivo_NivoLine maxMin={lineData} />

        </div>
    );
};

export default ComponenteGrafico_Nivo_Line;