import CalendarByYear from "../componentes_react/ComponenteGrafico_Nivo_Calendar";

// Ejemplo de cómo podrías recibir los datos del backend
// Ejemplo de cómo podrías recibir los datos del backend
const sampleYearlyData = {
    calendar: [
        {
            year: 2019,
            values: [
                { day: "2019-01-01", value: 30 }, // Ejemplo de media diaria
                { day: "2019-01-02", value: 35 },
                { day: "2019-01-03", value: 25 },
                { day: "2019-01-04", value: 42 },
                { day: "2019-01-05", value: 48 },
                { day: "2019-01-06", value: 32 },
                { day: "2019-01-07", value: 38 },
                { day: "2019-01-08", value: 28 },
                { day: "2019-01-09", value: 45 },
                { day: "2019-01-10", value: 51 },
                // ... más días del año 2019
            ],
        },
        {
            year: 2020,
            values: [
                // ... datos de la media diaria para 2020
            ],
        },
        // ... más años
    ],
    nivoLine: [
        {
            year: 2019,
            weeks: [
                { week: 1, min: 10, max: 50 },
                { week: 2, min: 20, max: 40 },
                { week: 3, min: 25, max: 45 },
                // ... más semanas de 2019
            ],
        },
        {
            year: 2020,
            weeks: [
                // ... datos de min/max por semana para 2020
            ],
        },
        // ... más años
    ],
};

export default function App() {
    return (
        <div className="w-full h-full bg-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendario */}
            <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Media Diaria</h2>
                <CalendarByYear yearlyData={sampleYearlyData.calendar} />

            </div>

            {/* BulletChart (o su reemplazo) */}
            <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Gráfico de Valores</h2>
                {/* {phData && <BulletChart data={phData} />} */}
                <p className="text-gray-500">Componente del gráfico por desarrollar...</p>
            </div>

            {/* Swarmplot */}
            <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Distribución de Datos</h2>
                {/* {phDistribution && <Swarmplot data={phDistribution} />} */}
                <p className="text-gray-500">Componente del swarmplot por desarrollar...</p>
            </div>

            {/* Espacio adicional si es necesario */}
            {/* <div className="shadow-md rounded-lg bg-white p-4 h-fit">
                <h2 className="text-xl font-semibold mb-4">Otro Componente</h2>
                <p className="text-gray-500">Información adicional o controles...</p>
            </div> */}
        </div>
    );
}