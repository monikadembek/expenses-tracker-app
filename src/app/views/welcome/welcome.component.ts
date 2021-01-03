import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  auth$: Observable<any> = of(false);

  constructor() { }

  ngOnInit(): void {
    this.auth$ = of(true);
  }

}
