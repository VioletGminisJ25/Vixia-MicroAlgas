//Interfaz base usada para datos de la API

//Aqui para los datos de las graficas
export interface SampleData {
  colors: {
    blue: boolean;
    red: boolean;
    white: boolean;
  };
  data: {
    ph: number;
    temperature: number;
  };
  rgb: {
    b: number;
    g: number;
    r: number;
  };
  wave_length: number[];
}

//Exportar una interza para datos recientes y seleccionados
export interface CompareData {
  last_data: SampleData;
  selected_data: SampleData;
}

//Interfaz para Calendario-ResponsiveLine-SwarmPlot
export interface CalendarData {
  values: { day: string; value: number }[];
  year: number;
}

export interface NivoLineData {
  id: string,
  data: { x: number; y: number }[];
}

export interface SwarmPlotData {
  ID: string;
  datos: {
    id: string;
    group: string;
    price: number;
    volume: number;
  }[],
  values: {
    price: number[]
    volume: number[]
  };
}

export interface Interface_Ph_Temp {
  Calendar: CalendarData[];
  ResponsiveLine: NivoLineData[];
  SwarmPlot: SwarmPlotData;
}