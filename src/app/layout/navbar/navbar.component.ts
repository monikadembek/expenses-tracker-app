import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Input()
  user$: Observable<firebase.User | null>;

  @Output()
  logout: EventEmitter<void> = new EventEmitter();

  constructor() { }

  onLogout(): void {
    this.logout.emit();
  }

}
