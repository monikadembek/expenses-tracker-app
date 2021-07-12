import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Expenses Tracker';
  user$: Observable<firebase.User | null> = null;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$;
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
