import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [NavbarComponent, NavigationComponent],
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutingModule
  ],
  exports: [
    NavbarComponent,
    NavigationComponent
  ]
})
export class LayoutModule { }
