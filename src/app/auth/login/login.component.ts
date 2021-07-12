import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { Credentials } from '../models/Credentials';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  type: 'login' | 'signup' | 'reset' = 'login';
  loading = false;
  serverMessage = '';
  user$: Observable<firebase.User | null>;
  mustValidate = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []]
    });
  }

  changeFormType(val: any): void {
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

  get isEmailInvalid(): boolean {
    return this.email.invalid && this.email.dirty;
  }

  get isPasswordInvalid(): boolean {
    return this.password.invalid && this.password.dirty;
  }

  get isPasswordConfirmInvalid(): boolean {
    return this.passwordConfirm.dirty && !this.passwordDoesMatch;
  }

  getErrorMessage(formControlName: string): string {
    let message = '';

    if (this.form.dirty && this.mustValidate) {
      switch (formControlName) {
        case 'email':
          console.log(this.email.errors);
          if (this.isEmailInvalid) {
            message = 'You must enter a valid email address';
          }
          break;
        case 'password':
          if (this.isPasswordInvalid) {
            message = 'Password must be at least 6 characters long';
          }
          break;
        case 'passwordConfirm':
          if (this.isPasswordConfirmInvalid) {
            message = 'Password does not match';
          }
          break;
      }
    }

    return message;
  }

  onSubmit(): void {
    this.loading = true;
    this.mustValidate = true;

    const credentials: Credentials = {
      email: this.email.value,
      password: this.password.value
    };

    if (this.form.valid && this.isLogin) {
      this.authService.login(credentials)
        .then(data => {
          console.log('data after user logged in', data);
          this.router.navigate(['/welcome']);
        })
        .catch(error => this.serverMessage = error);
    }
    if (this.form.valid && this.isSignup) {
      this.authService.register(credentials)
        .then(() => {
          this.router.navigate(['/welcome']);
        })
        .catch(error => this.serverMessage = error);
    }
    if (this.form.valid && this.isPasswordReset) {
      this.authService.resetPassword(credentials.email)
        .then(() => {
          this.serverMessage = 'Check your email';
        })
        .catch(error => this.serverMessage = error);
    }

    this.loading = false;
  }

}
