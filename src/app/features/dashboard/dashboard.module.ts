import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../../material/material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';

@NgModule({
  declarations: [DashboardContainerComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    MaterialModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
