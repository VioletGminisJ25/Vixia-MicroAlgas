import React from 'react';
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import type { SwarmplotData } from "../../scripts/data_interface"; // Importa la interfaz

interface Props {
    nivo_data: SwarmplotData[];
}

const Nivo_SwarmPlot: React.FC<Props> = ({ nivo_data }) => {
    return (
        <div>
            <ResponsiveSwarmPlot
                data={nivo_data}
                groups={['group A', 'group B', 'group C']}
                identity="id"
                value="price"
                valueScale={{ type: 'linear', min: 0, max: 500, reverse: false }}
                size={{
                    key: 'volume',
                    values: [
                        4,
                        20
                    ],
                    sizes: [
                        6,
                        20
                    ]
                }}
                spacing={0}
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
                enableGridX={false}
                axisTop={{
                    orient: 'top',
                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'group if vertical, price if horizontal',
                    legendPosition: 'middle',
                    legendOffset: -46,
                    truncateTickAt: 0
                }}
                axisRight={{
                    orient: 'right',
                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'price if vertical, group if horizontal',
                    legendPosition: 'middle',
                    legendOffset: 76,
                    truncateTickAt: 0
                }}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'group if vertical, price if horizontal',
                    legendPosition: 'middle',
                    legendOffset: 46,
                    truncateTickAt: 0
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 10,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'price if vertical, group if horizontal',
                    legendPosition: 'middle',
                    legendOffset: -76,
                    truncateTickAt: 0
                }}
            />
        </div>
    );
};

export default Nivo_SwarmPlot;


