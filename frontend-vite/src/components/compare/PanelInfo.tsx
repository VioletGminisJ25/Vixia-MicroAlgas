import React from 'react';
import type { SampleData } from '../../interface/Global_Interface';

interface PanelInfo {
    titulo: string;
    sampleData: SampleData | null;
}

const PanelInfo: React.FC<PanelInfo> = ({ titulo, sampleData }) => {
    return (
        <div className="h-fit w-60 bg-slate-100 dark:bg-[#0f1011] rounded-lg p-4 mt-20"> {/* Añadido padding para que el contenido no esté pegado a los bordes */}
            <p className="text-black dark:text-white text-xl font-semibold mb-8 text-center">{titulo}</p> {/* Clase para el título y un margen inferior */}

            {/* Contenedor del RGB (primera "línea") */}
            <div className="flex items-center justify-between mb-4"> {/* justify-between para separar RGB y el color box */}
                <p className="text-black dark:text-white font-bold">RGB</p>
                <div
                    className="w-24 h-10 rounded-md shadow-inner" // Ajustado el ancho y alto, añadido sombra interior
                    style={{
                        backgroundColor: sampleData?.rgb
                            ? `rgb(${sampleData?.rgb.r}, ${sampleData?.rgb.g}, ${sampleData?.rgb.b})`
                            : '#000000',
                    }}
                    title={sampleData
                        ? `rgb(${sampleData?.rgb.r}, ${sampleData?.rgb.g}, ${sampleData?.rgb.b})`
                        : 'rgb(NaN,NaN,NaN)'}
                />
            </div>

            {/* Contenedor de pH, Temperatura y Células (las siguientes "líneas") */}
            <div className="flex flex-col w-full space-y-3"> {/* flex-col para apilar verticalmente, space-y-3 para separación */}
                <div className="flex justify-between items-center w-full p-2 bg-gray-200 dark:bg-gray-800 rounded-md"> {/* Contenedor para cada línea de datos */}
                    <p className="text-black dark:text-white font-semibold">pH:</p>
                    <p className="text-black dark:text-white font-bold">
                        {sampleData?.data.ph ? Math.round(sampleData?.data.ph * 10) / 10 : 'sin datos'}
                    </p>
                </div>

                <div className="flex justify-between items-center w-full p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
                    <p className="text-black dark:text-white font-semibold">Temperatura:</p>
                    <p className="text-black dark:text-white font-bold">
                        {sampleData?.data.temperature ? Math.round(sampleData?.data.temperature * 10) / 10 : 'sin datos'} °C
                    </p>
                </div>

                <div className="flex justify-between items-center w-full p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
                    <p className="text-black dark:text-white font-semibold">Células:</p>
                    <p className="text-black dark:text-white font-bold">
                        {sampleData?.nc ? sampleData?.nc : 'sin datos'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PanelInfo;
