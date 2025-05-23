import React from 'react';
import { ResponsiveBullet } from '@nivo/bullet';
import { interpolatePlasma } from 'd3-scale-chromatic';

const createSymmetricColorRange = (steps = 9) => {
    const half = steps % 2 === 0 ? steps / 2 : Math.floor(steps / 2);
    const left = Array.from({ length: half }, (_, i) => interpolatePlasma(i / (steps - 1)));
    const center = steps % 2 === 0 ? [] : [interpolatePlasma(0.5)];
    const right = [...left].reverse();
    return [...left, ...center, ...right];
};

const colorRange = createSymmetricColorRange(9);

const bulletDataFijo = [
    {
        id: 'pH',
        ranges: [1.0,2.0,6.0, 7.0, 8.0],
        measures: [7.2],
        markers: [6.5],
    },
];

const Nivo_BulletChart: React.FC = () => {
    return (
        <div className="h-full w-full bg-white shadow-md rounded-lg p-4">
            <ResponsiveBullet
                data={bulletDataFijo}
                margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                spacing={46}
                titleAlign="start"
                titleOffsetX={-70}
                measureSize={0.2}
                rangeColors={colorRange}
            />
        </div>
    );
};

export default Nivo_BulletChart;
