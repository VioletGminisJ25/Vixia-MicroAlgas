import CalendarByYear from "../componentes_react/ComponenteGrafico_Nivo_Calendar";
import Swarmplot from "../componentes_react/ComponenteGrafico_Nivo_SwarmPlot";
// Ejemplo de cómo podrías recibir los datos del backend
const exampleDataPh = {
    calendar: [
        {
            year: 2019,
            values: [
                { day: "2019-01-01", value: 30 },
                { day: "2019-01-02", value: 35 },
                { day: "2019-01-03", value: 25 },
                { day: "2019-01-04", value: 42 },
                { day: "2019-01-05", value: 48 },
                { day: "2019-01-06", value: 32 },
                { day: "2019-01-07", value: 38 },
                { day: "2019-01-08", value: 28 },
                { day: "2019-01-09", value: 45 },
                { day: "2019-01-10", value: 51 },
                
            ],
        },
        {
            year: 2020,
            values: [
                { day: "2020-01-01", value: 30 }, 
                { day: "2020-01-02", value: 35 },
                { day: "2020-01-03", value: 25 },
                { day: "2020-01-04", value: 42 },
                { day: "2020-01-05", value: 48 },
                { day: "2019-01-06", value: 32 },
                { day: "2019-01-07", value: 38 },
                { day: "2019-01-08", value: 28 },
                { day: "2019-01-09", value: 45 },
                { day: "2019-01-10", value: 51 },
            ],
        },
        
    ],
    nivoLine: [
        {
            year: 2019,
            weeks: [
                { week: 1, min: 10, max: 50 },
                { week: 2, min: 20, max: 40 },
                { week: 3, min: 25, max: 45 },
            ],
        },
        {
            year: 2020,
            weeks: [
            ],
        },
    ],
    swarmplot:
        [
            {
              "id": "0.0",
              "group": "group A",
              "price": 455,
              "volume": 11
            },
            {
              "id": "0.1",
              "group": "group A",
              "price": 339,
              "volume": 17
            },
            {
              "id": "0.2",
              "group": "group A",
              "price": 189,
              "volume": 8
            },
            {
              "id": "0.3",
              "group": "group A",
              "price": 445,
              "volume": 13
            },
            {
              "id": "0.4",
              "group": "group A",
              "price": 222,
              "volume": 18
            },
            {
              "id": "0.5",
              "group": "group A",
              "price": 218,
              "volume": 8
            },
            {
              "id": "0.6",
              "group": "group A",
              "price": 197,
              "volume": 18
            },
            {
              "id": "0.7",
              "group": "group A",
              "price": 242,
              "volume": 14
            },
            {
              "id": "0.8",
              "group": "group A",
              "price": 183,
              "volume": 5
            },
            {
              "id": "0.9",
              "group": "group A",
              "price": 167,
              "volume": 20
            },
            {
              "id": "0.10",
              "group": "group A",
              "price": 146,
              "volume": 12
            },
        ]
};


export default function GraficaPh() {
    return (
        <div className="w-full h-full bg-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendario */}
            <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Media Diaria</h2>
                <CalendarByYear calendar_data={exampleDataPh.calendar} />

            </div>

            {/* BulletChart (o su reemplazo) */}
            <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Gráfico de Valores</h2>
                {/* {phData && <BulletChart data={phData} />} */}
                <p className="text-gray-500">Componente del gráfico por desarrollar...</p>
                <Swarmplot swarmPlot_data={exampleDataPh.swarmplot} />
            </div>

            {/* Swarmplot */}
            <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Distribución de Datos</h2>
                {/* {phDistribution && <Swarmplot data={phDistribution} />} */}
            </div>

            {/* Espacio adicional si es necesario */}
            {/* <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Otro Componente</h2>
                <p className="text-gray-500">Información adicional o controles...</p>
            </div> */}
        </div>
    );
}
