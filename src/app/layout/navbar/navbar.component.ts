import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() authState$: Observable<any> = of(false);
  @Input() user: any;

  constructor() { }

  ngOnInit(): void {
  }

}
