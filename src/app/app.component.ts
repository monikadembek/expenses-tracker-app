import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$;
    this.user$.subscribe(data => console.log('user subscribe', data));
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
