import React from 'react';
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import type { SwarmPlotData } from "../../../scripts/Global_Interface";

interface Props {
    nivo_data: SwarmPlotData["datos"] | undefined;
    nivo_data_values: SwarmPlotData["values"] | undefined;
    nivo_data_names: SwarmPlotData["ID"] | undefined;
}

const Nivo_SwarmPlot: React.FC<Props> = ({ nivo_data, nivo_data_values, nivo_data_names }) => {
    return (
        <div id='swarmplot' className="h-full w-full">
            <ResponsiveSwarmPlot
                animate={false}
                data={nivo_data || []} // Si nivo_data es undefined o null, usa un array vacío
                groups={[...new Set(nivo_data?.map(d => d.group) || [])]} // Evita errores si nivo_data es undefined
                value="price"
                valueFormat="$.2f"
                valueScale={{
                    type: 'linear',
                    min: nivo_data_values?.price?.[0], // Usa optional chaining para evitar errores
                    max: nivo_data_values?.price?.[1],
                    reverse: false
                }}
                size={{
                    key: 'volume',
                    values: [
                        nivo_data_values?.volume?.[0] || 0,
                        nivo_data_values?.volume?.[1] || 200
                    ],
                    sizes: [6, 20]
                }}
                forceStrength={9}
                simulationIterations={100}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6], ['opacity', 0.5]] }}
                margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
                tooltip={({ data }) => (
                    <div
                        style={{
                            background: 'white',
                            padding: '9px 12px',
                            border: '1px solid #ccc',
                            fontSize: '0.9rem',
                            borderRadius: '4px',
                        }}
                    >
                        <strong>Grupo:</strong> {data.group}<br />
                        <strong>{nivo_data_names}:</strong> {data.price}<br />
                        <strong>Volumen:</strong> {data.volume}
                    </div>
                )}
            />
        </div>
    );
};

export default Nivo_SwarmPlot;