import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { NivoLineData, SampleData } from '../../../scripts/Global_Interface';

interface NivoLineProps {
  datos?: SampleData | null;
  nivo_datos?: NivoLineData[] | null;
}

export default function Nivo_ResponsiveLine({ datos, nivo_datos }: NivoLineProps) {
  // Si pasan explicitamente nivo_datos (min/max por semana), lo usamos.
  // Si no, y hay 'datos', construimos la serie wave_length.
  const series: NivoLineData[] = useMemo(() => {
    if (nivo_datos && nivo_datos.length > 0) {
      return nivo_datos;
    }
    if (datos?.wave_length) {
      return [buildWaveSeries(datos)];
    }
    return [];
  }, [datos, nivo_datos]);

  if (series.length === 0) {
    return <div className="p-4">Sin datos para graficar</div>;
  }

  const showLegend = nivo_datos && nivo_datos.length > 1;

  return (
    <div className="w-[100%] h-[400px] "> {/* altura fija */}
      <ResponsiveLine
        data={series}
        margin={{ top: 30, right: 25, bottom: showLegend ? 50 : 25, left: 35 }}
        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        enablePoints={false}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Semana',
          legendOffset: 36,
          legendPosition: 'middle',

        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Valor',
          legendOffset: -40,
          legendPosition: 'start',
        }}
        colors={{ scheme: 'category10' }}
        pointSize={6}
        useMesh={true}
        enableGridX={false}
        enableGridY={false}
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
            <strong>{nivo_datos ? "Media:" : "valor"}:</strong> {point.data.yFormatted}<br></br>
            <strong>{nivo_datos ? "Semana:" : "rango espectro"}</strong> {point.data.xFormatted}<br />
          </div>
        )}
        legends={showLegend ? [
          {
            anchor: 'bottom-left',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 50,
            itemsSpacing: 8,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          }
        ] : []}
      />
    </div>
  );
}

// Auxiliar fuera del componente
function buildWaveSeries(datos: SampleData): NivoLineData {
  return {
    id: 'Longitud de onda',
    data: datos.wave_length.map((value, idx) => ({ x: idx + 1, y: value })),
  };
}