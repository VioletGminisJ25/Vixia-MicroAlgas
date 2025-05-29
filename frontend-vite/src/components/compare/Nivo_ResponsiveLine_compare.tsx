// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'
import type { CompareData } from '../../interface/Global_Interface';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
interface NivoLineProps {
    arduino_data?: CompareData | null;
}

export default function NivoLine({ arduino_data: data }: NivoLineProps) {
    //console.log(data)
    const serie = []
    if (data?.last_data != null) {
        const last_data = {
            id: 'Ultimos Datos',
            data: data?.last_data?.wave_length?.map((value, index) => ({ x: index + 1, y: value })) || [],
        }

        serie.push(last_data)
    }
    if (data?.selected_data != null) {
        const selected_data = {
            id: 'Datos Selecionados',
            data: data?.selected_data?.wave_length?.map((value, index) => ({ x: index + 1, y: value })) || [],
        }

        serie.push(selected_data)
    }

    console.log(serie)
    return (<div className="w-full h-full p-4"> {/* altura fija */}
        <ResponsiveLine
            data={serie}
            margin={{ top: 30, right: 25, bottom: 25, left: 35 }}
            xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            curve="monotoneX"
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
                    if (data?.last_data?.x && data.last_data?.x[Number(value) - 1] !== undefined) {
                        return data.last_data.x[Number(value) - 1];
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
            colors={['#008b1e', '#000000']}
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
                    <strong>{"valor"}:</strong> {point.data.yFormatted}<br></br>
                    <strong>Rango Espectro:</strong> {data?.last_data?.x && data.last_data?.x[point.data.x - 1] !== undefined ? data.last_data.x[point.data.x - 1] : 'N/A'}<br></br>
                </div>
            )}
            legends={[
                {
                    anchor: 'top-right',
                    direction: 'row',
                    translateX: 35,
                    translateY: -15,
                    itemWidth: 130,
                    itemHeight: 0,
                    symbolShape: 'circle'
                }
            ]}

        />
    </div>)
}


