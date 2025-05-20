import type { SampleData } from '../../interface/Global_Interface';
import Nivo_ResponsiveLine from './Nivo_ResponsiveLine_Index';
interface Componente1Props {
    datos: SampleData | null;
    // titulo: string;
    // lights: { roja: number; blanca: number; azul: number } | null;
}
/// Componente que recibe datos y un titulo y renderiza una grafica con los datos
export default function ComponenteGrafico_Nivo_LongitudDeOnda({ datos }: Componente1Props) {
    // Si no hay datos, establecemos un objeto de datos por defecto
    // Esto es útil para evitar errores al intentar acceder a propiedades de datos nulos
    //const colors = lights ?? { roja: 0, blanca: 0, azul: 0 };
    // const rgb = datos?.rgb ?? { r: 1, g: 0, b: 0 };
    //Estructura del componente, que contiene un div
    //Dentro del div hay un título, botones de colores y una tabla con la gráfica
    //Los botones de colores están habilitados o deshabilitados según los datos
    //La tabla contiene la gráfica y dos botones que muestran el pH y la temperatura
    return (
        <div className="flex flex-col items-center w-[50dvw] h-[80dvh] bg-slate-100 dark:bg-[#0f1011] p-4 rounded-lg shadow-lg dark:shadow-lg/100">
            <div className='flex flex-col items-center text-black dark:text-white font-bold'>{"Hola Luís"}</div>
            {/* Botones de colores: deshabilitamos según datos.colors */}
            <div className="flex flex-row space-x-4 mb-4 w-full h-[10%]">
                <button
                    id="red"
                    disabled={datos?.colors ? !datos.colors.red : false}
                    className={`w-[10%] h-12 rounded ${datos?.colors?.red
                        ? 'bg-red-500 text-white dark:text-white'
                        : 'bg-gray-300 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                        }`}
                    title={datos?.colors?.red ? 'Rojo activado' : 'Rojo desactivado'}
                >
                    Rojo
                </button>

                <button
                    id="white"
                    disabled={datos?.colors ? !datos.colors.white : false}
                    className={`w-[10%] h-12 rounded ${datos?.colors?.white
                        ? 'bg-white text-black dark:text-white dark:bg-gray-700'
                        : 'bg-gray-300 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                        }`}
                    title={datos?.colors?.white ? 'Blanco activado' : 'Blanco desactivado'}
                >
                    Blanco
                </button>

                <button
                    id="blue"
                    disabled={datos?.colors ? !datos.colors.blue : false}
                    className={`w-[10%] h-12 rounded ${datos?.colors?.blue
                        ? 'bg-blue-500 text-white dark:text-white'
                        : 'bg-gray-300 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                        }`}
                    title={datos?.colors?.blue ? 'Azul activado' : 'Azul desactivado'}
                >
                    Azul
                </button>
                {/*Bloque RGB */}
                <div className="flex flex-row items-center ml-auto space-x-2">
                    <p className="text-black dark:text-white font-bold">RGB</p>
                    <div
                        className="w-21 h-12 rounded"
                        style={{
                            backgroundColor: datos?.rgb
                                ? `rgb(${datos?.rgb.r}, ${datos?.rgb.g}, ${datos?.rgb.b})`
                                : '#000000',
                        }}
                        title={datos
                            ? `rgb(${datos?.rgb.r}, ${datos?.rgb.g}, ${datos?.rgb.b})`
                            : 'rgb(NaN,NaN,NaN)'}
                    />
                </div>
            </div>

            {/* Tabla principal */}
            <div className="flex items-center justify-center h-[80%] w-full  bg-white p-4 rounded-lg shadow-md">
                <Nivo_ResponsiveLine arduino_data={datos}></Nivo_ResponsiveLine>
            </div>

            {/* Botones de PH y Temp */}

            <div className="flex mt-4 w-full  h-[10%] flex-wrap">
                <button className=" grow-2 mr-5  bg-[#ffffff] dark:bg-[#1d1f21] text-black dark:text-white font-bold rounded">
                    <p> pH: {datos?.data.ph ? Math.round(datos.data.ph * 10) / 10 : 'sin datos'}</p>
                </button>
                <button className=" grow-2 mr-5 bg-[#ffffff] dark:bg-[#1d1f21] text-black dark:text-white font-bold rounded">
                    <p>{datos?.data.temperature ? Math.round(datos.data.temperature * 10) / 10 : 'sin datos'} °C</p>
                </button>
                <button className=" grow-1 mr-5 bg-[#ffffff] dark:bg-[#1d1f21] text-black dark:text-white font-bold rounded">
                    <p>{datos?.data.temperature ? datos.nc : 'sin datos'} ceculas</p>
                </button>
            </div>
        </div>
    );
}
