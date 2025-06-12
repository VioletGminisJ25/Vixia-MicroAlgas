import { ResponsiveLine } from '@nivo/line'
import type { SampleData } from '../../interface/Global_Interface';

interface NivoLineProps {
    data?: SampleData | null;
}

export default function NivoLine({  data }: NivoLineProps) {
    console.log(data)
    const serie = []
    if (data != null) {
        const last_data = {
            id: 'Last Data',
            data: data?.wave_length?.map((value, index) => ({ x: index +1, y: value })) || [],
        }

        serie.push(last_data)
    }
    
    if (serie.length == 0) {
        return (<div className="w-full h-full p-4"> {/* altura fija */}
            <div className="flex flex-col items-center justify-center h-full w-full">
                <p className="text-center text-red-500">No hay datos para mostrar</p>
            </div>
        </div>)
    }
    
    return (<div className="w-full h-full p-4"> {/* altura fija */}
        <ResponsiveLine
            markers={
                data?.x
                    ? [
                        {
                            axis: 'x',
                            value: data.x.findIndex((v) => v === 638.42) + 1, // +1 porque tus x empiezan en 1
                            lineStyle: {
                                stroke: '#e63946',
                                strokeWidth: 2,
                                strokeDasharray: '6 6',
                            },
                            legend: '638.42',
                            legendPosition: 'top',
                            textStyle: {
                                fill: '#e63946',
                                fontSize: 12,
                                fontWeight: 600,
                            },
                        },
                    ]
                    : []
            }
            data={serie}
            margin={{ top: 30, right: 25, bottom: 25, left: 35 }}
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            curve="monotoneX"
            colors={['#008b1e']}
            axisTop={null}
            axisRight={null}
            enablePoints={false}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Rango Espectro',
                legendOffset: 36,
                legendPosition: 'middle',

                format: (value) => {
                    if (data?.x && data.x[Number(value) - 1] !== undefined) {
                        return data.x[Number(value) - 1];
                    }
                    return '';
                },
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Valor',
                legendOffset: -40,
                legendPosition: 'start',
            }}
            pointSize={6}
            useMesh={true}
            enableGridX={true}
            enableGridY={true}
            tooltip={({ point }) => (
                <div
                    style={{
                        background: 'white',
                        padding: '9px 12px',
                        border: '1px solid #ccc',
                        fontSize: '0.9rem',
                        borderRadius: '4px',
                    }}
                >
                    <strong>{"valor"}:</strong> {Math.round(point.data.y * 100) / 100}<br></br>
                    <strong>Rango Espectro:</strong> {data?.x && data.x[point.data.x - 1] !== undefined ? data.x[point.data.x - 1] : 'N/A'}<br></br>
                </div>
            )}

        />
    </div>)
}