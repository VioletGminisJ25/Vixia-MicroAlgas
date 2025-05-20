import React from 'react';
import type { SampleData } from '../../interface/Global_Interface';

interface PanelInfo {
    titulo: string;
    sampleData: SampleData | null;
}

const PanelInfo: React.FC<PanelInfo> = ({ titulo, sampleData }) => {
    return (
        <div className="h-[25%] w-60 ml-16 bg-slate-100 dark:bg-[#0f1011] rounded-lg">
            <p>{titulo}</p>
            <div className="flex items-center justify-center h-full w-full">
                    <div className="flex flex-row items-center ml-auto space-x-2">
                        <p className="text-black dark:text-white font-bold">RGB</p>
                        <div
                            className="w-21 h-12 rounded"
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
                <div className="flex  w-full h-full flex-wrap">
                    <button className=" grow-2  text-black dark:text-white font-bold ">
                        <p> pH: {sampleData?.data.ph ? Math.round(sampleData?.data.ph * 10) / 10 : 'sin datos'}</p>
                    </button>
                    <button className=" grow-2 text-black dark:text-white font-bold ">
                        <p>{sampleData?.data.temperature ? Math.round(sampleData?.data.temperature * 10) / 10 : 'sin datos'} °C</p>
                    </button>
                    <button className=" grow-1  text-black dark:text-white font-bold ">
                        <p>{sampleData?.nc ? sampleData?.nc : 'sin datos'} Células</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PanelInfo;
