import { ResponsiveLineCanvas } from '@nivo/line';
import type { NivoLineData } from '../../interface/Global_Interface';
import { format } from 'date-fns';

interface NivoLineProps {
    data: NivoLineData; // Esperamos un array de NivoLineData
}

export default function NivoLine({ data }: NivoLineProps) {
    console.log("Datos recibidos en NivoLine:", data);


    return (
        <div className="w-full h-full p-4">
            <ResponsiveLineCanvas /* or Line for fixed dimensions */
                data={[data]} /* data is an array of objects */
                margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                xScale={{ type: 'time', format: '%Y-%m-%dT%H:%M:%S', precision: 'minute', useUTC: false }}
                colors={{ scheme: 'dark2' }}
                axisBottom={{
                    format: '%m-%d %H:%M',
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: 45,
                    legend: 'Tiempo',
                    legendOffset: 106,
                    legendPosition: 'middle',
                }}
                pointSize={10}
                enablePoints={false}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'seriesColor' }}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        translateX: 100,
                        itemWidth: 80,
                        itemHeight: 22,
                        symbolShape: 'circle'
                    }
                ]}
                tooltip={({ point }) => (
                    <div
                        style={{
                            background: 'white',
                            padding: '9px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            color: '#000',
                        }}
                    >
                        <strong>{point.seriesId}: </strong>
                        <strong >
                            y: {point.data.yFormatted},
                        </strong>
                        <span> </span>
                        <strong style={{ marginRight: '10px' }}>
                            x: {format(new Date(point.data.x), 'MM-dd HH:mm')}
                        </strong>
                    </div>
                )
                }
            />
        </div >
    );
}

