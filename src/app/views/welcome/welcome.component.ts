import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  user$: Observable<firebase.User | null>;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user$ = this.authService.user$;
  }

}
