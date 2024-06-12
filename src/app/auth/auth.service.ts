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
      console.log('Error de login:', error);
    }
  }

  async register(email: string, password: string, displayName: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        await userCredential.user.updateProfile({
          displayName: displayName
        });
        console.log('User registrado com displayName:', displayName); 
    
        await this.syncUserProfileUpdate();
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.log('Error durante o registro:', error);
    }
  }

  private async syncUserProfileUpdate() {
    let user = await this.afAuth.currentUser;
    let attempts = 0;
    while (user && !user.displayName && attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 500));
      user = await this.afAuth.currentUser;
      attempts++;
      console.log(`Attempt ${attempts}: User displayName:`, user?.displayName);
    }
  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  async forgotPassword(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Password reset email enviado');
    } catch (error) {
      console.log('Error durante password reset:', error);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user));
  }

  getUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          const firstName = user.displayName ? user.displayName.split(' ')[0] : '';
          return {
            displayName: user.displayName,
            email: user.email,
            firstName: firstName
          };
        } else {
          return null;
        }
      })
    );
  }
}
