import React from 'react';
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import type { SwarmPlotData } from "../../scripts/data_interface";

interface Props {
    nivo_data: SwarmPlotData["datos"] | undefined;
    nivo_data_values: SwarmPlotData["values"] | undefined;
}

const Nivo_SwarmPlot: React.FC<Props> = ({ nivo_data, nivo_data_values }) => {
    console.log("Nivo_SwarmPlot", nivo_data); // Log para depuración
    console.log("Nivo_SwarmPlot_values", nivo_data_values); // Log para depuración
    console.log(window.location.pathname); // Log para depuración
    return (
        <div id='swarmplot' className="h-full w-full">
            <ResponsiveSwarmPlot
                data={nivo_data || []}
                groups={[...new Set(nivo_data?.map(d => d.group))]}
                value="price"
                valueFormat="$.2f"
                valueScale={{ type: 'linear', min: nivo_data_values?.price[0], max: nivo_data_values?.price[1], reverse: false }}
                size={{
                    key: 'volume',
                    values: [
                        nivo_data_values?.volume[0] || 0,
                        nivo_data_values?.volume[1] || 200
                    ],
                    sizes: [
                        6,
                        20
                    ]
                }}
                forceStrength={9}
                simulationIterations={100}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.6
                        ],
                        [
                            'opacity',
                            0.5
                        ]
                    ]
                }}
                margin={{ top: 80, right: 100, bottom: 80, left: 100 }}
                axisTop={{

                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'guille dime tu',
                    legendPosition: 'middle',
                    legendOffset: -46,
                    truncateTickAt: 0
                }}
                axisRight={{

                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'guille dime tu',
                    legendPosition: 'middle',
                    legendOffset: 76,
                    truncateTickAt: 0
                }}
                axisBottom={{

                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'guille dime tu',
                    legendPosition: 'middle',
                    legendOffset: 46,
                    truncateTickAt: 0
                }}
                axisLeft={{
                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'guille dime tu',
                    legendPosition: 'middle',
                    legendOffset: -76,
                    truncateTickAt: 0
                }}
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
                        <strong>Precio:</strong> {data.price}<br />
                        <strong>Volumen:</strong> {data.volume} {/* Aquí mostramos el volume */}
                    </div>
                )}
            />
        </div>
    );
};

export default Nivo_SwarmPlot;


