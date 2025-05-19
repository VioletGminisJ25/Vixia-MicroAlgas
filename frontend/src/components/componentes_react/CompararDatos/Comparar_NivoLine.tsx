// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'
import type { CompareData } from '../../../scripts/Global_Interface';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
interface NivoLineProps {
    wave_length?: CompareData | null;
}

export default function NivoLine({ wave_length: data }: NivoLineProps) {
    console.log(data?.last_data)
    const serie = []
     if( data?.last_data != null ){
        const last_data =  {
            id: 'Last Data',
            data: data?.last_data?.wave_length?.map((value, index) => ({ x: index + 1, y: value })) || [],
        }

        serie.push(last_data)
    }
    if( data?.selected_data != null ){
        const selected_data = {
            id: 'Selected Data',
            data: data?.selected_data?.wave_length?.map((value, index) => ({ x: index + 1, y: value })) || [ ],
        }

        serie.push(selected_data)
    }
    return (<div className="w-[100%] h-[400px] "> {/* altura fija */}
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
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Valor',
                legendOffset: -40,
                legendPosition: 'start',
            }}
            colors={{ scheme: 'category10' }}
            pointSize={6}
            useMesh={true}
            enableGridX={false}
            enableGridY={false}
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

                </div>
            )}
        />
    </div>)
}