import { ResponsiveLine, ResponsiveLineCanvas } from '@nivo/line';
import type { NivoLineData, Sensor } from '../../interface/Global_Interface';

interface NivoLineProps {
    data: NivoLineData; // Esperamos un array de NivoLineData
}

export default function NivoLine({ data }: NivoLineProps) {
    console.log("Datos recibidos en NivoLine:", data); // Para verificar que los datos llegan bien

    return (
        <div className="w-full h-full p-4">
            <ResponsiveLineCanvas /* or Line for fixed dimensions */
                data={[data]} /* data is an array of objects */
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: 90,
                    legend: 'Tiempo',
                    legendOffset: 36,
                    legendPosition: 'middle',
                    tickValues: 'every 10', // 👈 esto define que solo haya un tick cada 10 unidades
                }}
                axisLeft={{ legend: 'count', legendOffset: -40 }}
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
            />
        </div>
    );
}