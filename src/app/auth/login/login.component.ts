import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';
import { Credentials } from '../models/Credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = this.fb.group({});
  type: 'login' | 'signup' | 'reset' = 'login';
  loading = false;
  serverMessage = '';
  user$: Observable<User | null>;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []]
    });
    this.authService.user$.subscribe(data => console.log('user', data));
  }

  // changing the type of form that user chooses to fill
  changeType(val: any): void {
    this.type = val;
  }

  get isLogin(): boolean {
    return this.type === 'login';
  }

  get isSignup(): boolean {
    return this.type === 'signup';
  }

  get isPasswordReset(): boolean {
    return this.type === 'reset';
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get passwordConfirm(): AbstractControl {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch(): boolean {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  onSubmit(): void {
    this.loading = true;

    const credentials: Credentials = {
      email: this.email.value,
      password: this.password.value
    };

    if (this.isLogin) {
      this.authService.login(credentials)
        .then(() => {
          this.router.navigate(['/welcome']);
        })
        .catch(error => this.serverMessage = error);
    }
    if (this.isSignup) {
      this.authService.register(credentials)
        .then(() => {
          this.router.navigate(['/welcome']);
        })
        .catch(error => this.serverMessage = error);
    }
    if (this.isPasswordReset) {
      this.authService.resetPassword(credentials.email)
        .then(() => {
          this.serverMessage = 'Check your email';
        })
        .catch(error => this.serverMessage = error);
    }

    this.loading = false;
  }

}