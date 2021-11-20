import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Chart } from '../models/dashboard-models';

@Component({
  selector: 'app-graph-tile',
  templateUrl: './graph-tile.component.html',
  styleUrls: ['./graph-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphTileComponent implements OnInit {

  @Input() title = '';
  @Input() chart: Chart;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

}
