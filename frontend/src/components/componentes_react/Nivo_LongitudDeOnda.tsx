import { ResponsiveLine } from '@nivo/line' // Importamos el componente ResponsiveLine de Nivo
import type { SampleData } from '../../scripts/data_interface'

interface NivoLineProps {
    datos: SampleData | null
}

/**
 * Componente que renderiza un gráfico de líneas utilizando Nivo
 * @param {SampleData | null} datos - Datos a graficar
 * @returns {JSX.Element} - Componente de gráfico de líneas
 */

//Datos de la grafica
//El componente recibe un objeto de datos que contiene la longitud de onda
export default function Nivo_LongitudDeOnda({ datos }: NivoLineProps) {
    const isDark = document.documentElement.classList.contains("dark");
    if (!datos) return <div className="p-4">Sin datos</div>

    const { wave_length } = datos

    const series = [
        {
            id: 'Longitud de onda',
            data: wave_length.map((value, index) => ({
                x: index,
                y: value,
            })),
        },
    ]
    //Estructura del componente de Nivo
    //https://nivo.rocks/line/
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
                    legend: 'Indice de medicion',
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
