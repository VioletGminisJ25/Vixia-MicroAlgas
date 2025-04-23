import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import type { SampleData } from '../../scripts/data_interface'

interface NivoLineProps {
    datos: SampleData | null
}

export default function NivoLine({ datos }: NivoLineProps) {
    const isDark = document.documentElement.classList.contains("dark");
    if (!datos) return <div className="p-4">Sin datos</div>

    // 1. Extraemos el array
    const { wave_lenght } = datos

    // 2. Creamos la serie
    const series = [
        {
            id: 'Longitud de onda',
            data: wave_lenght.map((value, index) => ({
                // Usa idx o la propia longitud como x
                x: index,
                y: value,
            })),
        },
    ]
    
    return (
        <div className="w-full h-full max-w-full overflow-hidden px-[3%] pb-[5%]">
            <ResponsiveLine
                data={series}
                margin={{ top: 30, right: 25, bottom: 25, left: 35 }}
                xScale={{ type: 'linear', min: 0, max: 'auto', }}
                yScale={{ type: 'linear', min: 0, max: 1000, }}
                yFormat=" >-1.2f"
                curve="cardinal"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'transportation',
                    legendOffset: 36,
                    legendPosition: 'middle',
                    truncateTickAt: 0
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'count',
                    legendOffset: -40,
                    legendPosition: 'middle',
                    truncateTickAt: 0
                }}
                enableGridX={false}
                enableGridY={false}
                enablePoints={false}
                colors={{ scheme: 'category10' }}
                pointSize={10}
                pointColor={{ from: 'color', modifiers: [] }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabel="data.yFormatted"
                pointLabelYOffset={-12}
                areaOpacity={1}
                enableTouchCrosshair={true}
                useMesh={true}
                legends={[]}
                motionConfig="default"
                
            />
        </div>
    )
}
