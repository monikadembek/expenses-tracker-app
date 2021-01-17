import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Expenses Tracker';

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    // refresh user data in store
    this.authService.user$.subscribe(data => {
      console.log('user subscribe', data);
      this.authService.refreshUserStore(data);
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
