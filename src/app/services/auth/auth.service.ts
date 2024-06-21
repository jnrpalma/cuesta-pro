import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.afAuth.setPersistence('session');
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/dashboard/overview']);
    } catch (error) {
      console.log('Erro de login:', error);
    }
  }

  async register(email: string, password: string, displayName: string, profileImage: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        const filePath = `profile_images/${userCredential.user.uid}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.dataURLtoFile(profileImage, 'profileImage.png'));

        task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
            if (userCredential.user) { // Adicionando verificação
              await userCredential.user.updateProfile({
                displayName: displayName,
                photoURL: downloadURL
              });
              await this.syncUserProfileUpdate();
              this.router.navigate(['/dashboard/overview']);
            }
          })
        ).subscribe();
      }
    } catch (error) {
      console.log('Erro durante o registro:', error);
    }
  }

  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || ''; // Adicionando verificação
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  private async syncUserProfileUpdate() {
    let user = await this.afAuth.currentUser;
    let attempts = 0;
    while (user && (!user.displayName || !user.photoURL) && attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 500));
      user = await this.afAuth.currentUser;
      attempts++;
      console.log(`Attempt ${attempts}: User displayName:`, user?.displayName, 'photoURL:', user?.photoURL);
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
      console.log('Erro durante password reset:', error);
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
            firstName: firstName,
            photoURL: user.photoURL
          };
        } else {
          return null;
        }
      })
    );
  }
}
