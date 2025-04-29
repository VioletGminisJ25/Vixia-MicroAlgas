import type { SampleData } from '../../scripts/data_interface';
import NivoLine from './Nivo_ResponsiveLine';
interface Componente1Props {
    datos: SampleData | null;
    titulo: string;
}
/// Componente que recibe datos y un titulo y renderiza una grafica con los datos
export default function ComponenteGrafico_Nivo_LongitudDeOnda({ datos, titulo }: Componente1Props) {
    // Si no hay datos, establecemos un objeto de datos por defecto
    // Esto es útil para evitar errores al intentar acceder a propiedades de datos nulos
    const colors = datos?.colors ?? { red: false, white: false, blue: false };
    
    //Estructura del componente, que contiene un div
    //Dentro del div hay un título, botones de colores y una tabla con la gráfica
    //Los botones de colores están habilitados o deshabilitados según los datos
    //La tabla contiene la gráfica y dos botones que muestran el pH y la temperatura
    return (
        <div className="flex flex-col items-center w-full h-[100%] bg-slate-100 dark:bg-[#0f1011] p-4 rounded-lg shadow-lg dark:shadow-lg/100">
            <div className='flex flex-col items-center text-black dark:text-white font-bold'>{titulo}</div>
            {/* Botones de colores: deshabilitamos según datos.colors */}
            <div className="flex flex-row space-x-4 mb-4 w-full">
                <button
                    id="red"
                    disabled={!colors.red}
                    className={`w-[10%] h-12 rounded 
            ${colors.red ? 'bg-red-500 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                    title={colors.red ? 'Se uso' : 'No se uso'}>
                    Rojo
                </button>

                <button
                    id="white"
                    disabled={!colors.white}
                    className={`w-[10%] h-12 rounded 
            ${colors.white ? 'bg-white text-black' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                    title={colors.white ? 'Se uso' : 'No se uso'}>
                    Blanco
                </button>

                <button
                    id="blue"
                    disabled={!colors.blue}
                    className={`w-[10%] h-12 rounded 
            ${colors.blue ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                    title={colors.blue ? 'Se uso' : 'No se uso'}
                >
                    Azul
                </button>

                {/*Bloque RGB */}
                <div className="flex flex-row items-center ml-auto space-x-2">
                    <p className="text-black dark:text-white font-bold">RGB</p>
                    <div
                        className="w-21 h-12 rounded"
                        style={{
                            backgroundColor: datos
                                ? `rgb(${datos.rgb.r}, ${datos.rgb.g}, ${datos.rgb.b})`
                                : '#000000',
                        }}
                        title={datos
                            ? `rgb(${datos.rgb.r}, ${datos.rgb.g}, ${datos.rgb.b})`
                            : 'rgb(NaN,NaN,NaN)'}
                    />
                </div>
            </div>

            {/* Tabla principal */}
            <div className="flex items-center justify-center h-full w-full bg-white p-4 rounded-lg shadow-md overflow-auto">
                <NivoLine datos={datos}></NivoLine>
            </div>

            {/* Botones de PH y Temp */}
            <div className="flex space-x-4 mt-4 w-full">
                <button className="w-1/2 h-12 bg-[#ffffff] dark:bg-[#1d1f21] text-black dark:text-white font-bold rounded">
                    <p>PH: {datos?.data.ph ?? 'sin datos'}</p>
                </button>
                <button className="w-1/2 h-12 bg-[#ffffff] dark:bg-[#1d1f21] text-black dark:text-white font-bold rounded">
                    <p>{datos?.data.temperature ?? 'sin datos'} °C</p>
                </button>
            </div>
        </div>
    );
}
