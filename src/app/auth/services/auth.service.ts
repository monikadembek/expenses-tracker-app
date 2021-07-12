import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Credentials } from '../models/Credentials';
import { AuthStore } from '../services/auth-store';
import { AuthState } from './auth-state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth,
              private authStore: AuthStore) { }

  get user$(): Observable<firebase.User | null> {
    return this.fireAuth.user;
  }

  get userId(): string {
    return this.authStore.state.uid;
  }

  login({ email, password }: Credentials): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  register({ email, password }: Credentials): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  loginWithGoogle(): Promise<firebase.auth.UserCredential> {
    return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Promise<void> {
    return this.fireAuth.signOut();
  }

  storeUserData(data: firebase.auth.UserCredential): void {
    const userData: AuthState = {
      uid: data.user.uid,
      email: data.user.email,
      providerId: data.additionalUserInfo.providerId,
    };
    console.log('store user data', userData);
    this.authStore.setState({...userData});
  }

  refreshUserStore(data: firebase.User): void {
    this.authStore.setPartialState<string>('uid', data.uid);
    console.log('refreshed user store', this.authStore.state);
  }



}
