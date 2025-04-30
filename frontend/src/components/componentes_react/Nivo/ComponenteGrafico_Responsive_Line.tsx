import React from 'react';
import Nivo_NivoLine from "./Nivo_ResponsiveLine";
import type { NivoLineData } from "../../../scripts/Global_Interface"; // Importa la interfaz

interface Props {
    lineData: NivoLineData[]; // Cambia el nombre de la prop para mayor claridad
}

const ComponenteGrafico_Nivo_Line: React.FC<Props> = ({ lineData }) => {
    return (
        <div className="h-full w-full"> {/* El div contenedor ocupa todo el espacio disponible */}
            <Nivo_NivoLine nivo_datos={lineData} />

        </div>
    );
};

export default ComponenteGrafico_Nivo_Line;