/*Este archivo contiene un componente React que muestra información sobre un dato de muestra.
El componente recibe un objeto de tipo SampleData y muestra información sobre el pH, la temperatura y las células y el color RGB.
Es reutilizable para ultimos datos y selecionados en comprar, y en index para los ulitmos datos.
*/

import React from 'react';
import type { SampleData } from '../interface/Global_Interface';

interface PanelInfo {
    titulo: string;
    sampleData: SampleData | null;
}

const PanelInfo: React.FC<PanelInfo> = ({ titulo, sampleData }) => {
    return (
        <div className="h-fit w-60 bg-slate-100 dark:bg-[#0f1011] rounded-lg p-4 mt-20"> 
            <p className="text-black dark:text-white text-xl font-semibold mb-8 text-center">{titulo}</p>

            {/* Contenedor del RGB (primera "línea") */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-black dark:text-white font-bold">RGB</p>
                <div
                    className="w-24 h-10 rounded-md shadow-inner"
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

            {/* Contenedor de pH, Temperatura y Células*/}
            <div className="flex flex-col w-full space-y-3">
                <div className="flex justify-between items-center w-full p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
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
