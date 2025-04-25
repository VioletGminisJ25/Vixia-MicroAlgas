//Interfaz base usada para datos de la API
//Concretamente datos recibidos para tablas index y comparar
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

//Interfaz para Calendario
export interface CalendarData {
  year: number;
  values: { day: string; value: number }[];
}

export interface SwarmPlotData {
  id: string;
  group: string;
  price: number;
  volume: number;
}

export interface NivoLineData {

  year: number;
  weeks: {
    week : { min: number; max: number }
  }

}