import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit {

  data = [
    {
      name: 'Income',
      value: 6000
    },
    {
      name: 'Expense',
      value: 3366
    }
  ];

  options = {
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

  chart = {
    data: this.data,
    options: this.options
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
}
