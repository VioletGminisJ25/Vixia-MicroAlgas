//Interfaz base usada para datos de la API

//Aqui para los datos de las graficas
export interface SampleData {
    datetime: string,
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
    x: number[]
    nc: number
}

//Interfaz para Calendario-ResponsiveLine-SwarmPlot
export interface CalendarData {
    values: { day: string; value: number }[];
    year: number;
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


export interface Config {
    name: string;
    time_between_measurements: string;
    time_light: string;
    time_dark: string;
    light_white: string;
    light_blue: string;
    light_red: string;
}

export interface LightsState {
    roja: boolean;
    azul: boolean;
    blanca: boolean;
}
export interface Interface_Ph_Temp {
    Calendar: CalendarData[];
    ResponsiveLine: NivoLineData[];
    SwarmPlot: SwarmPlotData;
}

export interface NivoLineData {
    data: { x: string | number; y: number }[];
    id: string,
}

export interface NivoLineDataTest {
    data: { x: string | number; y: number }[];
    id: Date,
}

export interface Sensor {
    0: NivoLineData;
    1: NivoLineData;
}[]

export interface SensorData {
    nc_time: NivoLineData;
    nc_value: NivoLineData;
    sensors: Sensor
}

//Exportar una interza para datos recientes y seleccionados
export interface CompareData {
    last_data: SampleData | null;
    selected_data: SampleData | null;
}
