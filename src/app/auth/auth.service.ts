import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.setPersistence('session');
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.log('Error during login:', error);
    }
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  async forgotPassword(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Password reset email sent');
    } catch (error) {
      console.log('Error during password reset:', error);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user));
  }

  getUser(): Observable<any> {
    return this.afAuth.authState;
  }
}
