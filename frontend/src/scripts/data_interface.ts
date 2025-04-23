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
  wave_lenght: number[];
}

export interface CompareData {
  last_data: SampleData;
  selected_data: SampleData;
}

