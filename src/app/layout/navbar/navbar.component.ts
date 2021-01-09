import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Input()
  user$: Observable<User | null>;

  @Output()
  logout: EventEmitter<void> = new EventEmitter();

  constructor() { }

  onLogout(): void {
    this.logout.emit();
  }

}
