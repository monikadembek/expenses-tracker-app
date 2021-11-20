export interface ChartOptions {
  showXAxis: boolean;
  showYAxis: boolean;
  gradient: boolean;
  showLegend: boolean;
  legendPosition: string;
  showXAxisLabel: boolean;
  yAxisLabel: string;
  showYAxisLabel: boolean;
  xAxisLabel: string;
  colorScheme: ColorScheme;
}

export interface ColorScheme {
  domain: string[];
}

export interface DataItem {
  name: string;
  value: number;
}

export interface Chart {
  data: DataItem[];
  options: ChartOptions;
}
