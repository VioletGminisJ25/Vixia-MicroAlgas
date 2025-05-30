// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'
import type { SampleData } from '../../interface/Global_Interface';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
interface NivoLineProps {
    arduino_data?: SampleData | null;
}

export default function NivoLine({ arduino_data: data }: NivoLineProps) {
    const currentTheme = localStorage.getItem("theme");

    const lightTheme = {
        background: "#ffffff",
        text: {
            fontSize: 11,
            fill: "#333333",
        },
        axis: {
            domain: { line: { stroke: "#777", strokeWidth: 1 } },
            legend: { text: { fontSize: 12, fill: "#333" } },
            ticks: {
                line: { stroke: "#777", strokeWidth: 1 },
                text: { fontSize: 11, fill: "#333" },
            },
        },
        grid: { line: { stroke: "#ddd", strokeWidth: 1 } },
        legends: {
            text: { fontSize: 11, fill: "#333" },
        },
        tooltip: {
            container: {
                background: "#fff",
                color: "#333",
                fontSize: 12,
            },
        },
    };

    const darkTheme = {
        background: "#1a1a1a",
        text: {
            fontSize: 11,
            fill: "#f0f0f0",
        },
        axis: {
            domain: { line: { stroke: "#888", strokeWidth: 1 } },
            legend: { text: { fontSize: 12, fill: "#f0f0f0" } },
            ticks: {
                line: { stroke: "#888", strokeWidth: 1 },
                text: { fontSize: 11, fill: "#f0f0f0" },
            },
        },
        grid: { line: { stroke: "#444", strokeWidth: 1 } },
        legends: {
            text: { fontSize: 11, fill: "#f0f0f0" },
        },
        tooltip: {
            container: {
                background: "#333",
                color: "#f0f0f0",
                fontSize: 12,
            },
        },
    };

    const selectedTheme = currentTheme === "dark" ? darkTheme : lightTheme;
    console.log(data)
    const serie = []
    if (data != null) {
        const last_data = {
            id: 'Last Data',
            data: data?.wave_length?.map((value, index) => ({ x: index + 1, y: value })) || [],
        }

        serie.push(last_data)
    }
    if (data != null) {
        const selected_data = {
            id: 'Selected Data',
            data: data?.wave_length?.map((value, index) => ({ x: index + 1, y: value })) || [],
        }

        serie.push(selected_data)

        // 👇 Añade un punto personalizado a x = 10, y = 0.82

    }
    return (<div className="w-full h-full p-4"> {/* altura fija */}
        <ResponsiveLine
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
                    <strong>{"valor"}:</strong> {point.data.yFormatted}<br></br>
                    <strong>Rango Espectro:</strong> {data?.x && data.x[point.data.x - 1] !== undefined ? data.x[point.data.x - 1] : 'N/A'}<br></br>
                </div>
            )}
           
        />
    </div>)
}