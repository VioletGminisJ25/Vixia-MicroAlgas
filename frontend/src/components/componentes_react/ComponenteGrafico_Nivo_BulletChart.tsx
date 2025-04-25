
// ComponenteGrafico_Nivo_BuletChart.tsx
import React from 'react';
import { ResponsiveBullet } from '@nivo/bullet';

const Nivo_BulletChart: React.FC = () => {
    const bulletDataFijo = [
        {
            id: 'pH',
            ranges: [6.0, 7.0, 8.0],
            measures: [7.2],
            markers: [6.5],
        },
    ];

    console.log("Bullet Chart Data:", bulletDataFijo); // Agregamos un console.log para ver la estructura

    return (
        <div className="h-24">
            <ResponsiveBullet
                data={bulletDataFijo}
                margin={{ top: 5, right: 50, bottom: 50, left: 50 }}
                spacing={40}
                titleAlign="start"
                titleOffsetX={-70}
                measureSize={0.6}
                markerSize={0.8}
                rangeColors="blues"
                measureColors="nivo"
                markerColors="accent"
            />
        </div>
    );
};

export default Nivo_BulletChart;