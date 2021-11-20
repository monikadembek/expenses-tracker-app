import { Component, OnInit } from '@angular/core';
import { Chart, ChartOptions, DataItem } from '../models/dashboard-models';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {

  chart: Chart;
  title = 'Income / Expense comparison';

  constructor() {
  }

  ngOnInit(): void {
    this.chart = this.getChartMockData();
  }

  getChartMockData(): Chart {
    const data: DataItem[] = [
      {
        name: 'Income',
        value: 6000
      },
      {
        name: 'Expense',
        value: 3366
      }
    ];

    const options: ChartOptions = {
      showXAxis: true,
      showYAxis: true,
      gradient: false,
      showLegend: true,
      legendPosition: 'below',
      showXAxisLabel: true,
      yAxisLabel: 'Finance type',
      showYAxisLabel: true,
      xAxisLabel: 'Value',
      colorScheme: {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
      }
    };

    const chart: Chart = {
      data,
      options
    };

    return chart;
  }
}
