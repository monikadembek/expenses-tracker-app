import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './auth/models/User';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Expenses Tracker';
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$;
  }

  handleLogout(): void {
    this.authService.logout();
  }
}
