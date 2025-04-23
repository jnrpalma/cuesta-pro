import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router: Router = inject(Router);

  constructor(
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.afAuth.setPersistence('session');
  }

  /** Faz login e redireciona para o dashboard */
  async login(email: string, password: string) {
    console.log('[AuthService] login() chamado com', { email });
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('[AuthService] signInWithEmailAndPassword OK:', credential.user?.email);
      this.router.navigate(['/dashboard/overview']);
    } catch (error) {
      console.error('[AuthService] Erro de login:', error);
      throw error;
    }
  }

  /** Cadastra usuário, faz upload de foto e atualiza displayName/photoURL */
  async register(
    email: string,
    password: string,
    displayName: string,
    profileImage: string
  ) {
    console.log('[AuthService] register() chamado com', { email, displayName });
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user!;
      if (profileImage) {
        const filePath = `profile_images/${user.uid}`;
        const fileRef = this.storage.ref(filePath);
        const file = this.dataURLtoFile(profileImage, 'profileImage.png');
        const task = this.storage.upload(filePath, file);
        await task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
            await user.updateProfile({ displayName, photoURL: downloadURL });
            await this.syncUserProfileUpdate();
            this.router.navigate(['/dashboard/overview']);
          })
        ).toPromise();
      } else {
        await user.updateProfile({ displayName });
        await this.syncUserProfileUpdate();
        this.router.navigate(['/dashboard/overview']);
      }
    } catch (error) {
      console.error('[AuthService] Erro durante o registro:', error);
      throw error;
    }
  }

  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  private async syncUserProfileUpdate() {
    let user = await this.afAuth.currentUser;
    let attempts = 0;
    while (user && (!user.displayName || !user.photoURL) && attempts < 5) {
      await new Promise((res) => setTimeout(res, 500));
      user = await this.afAuth.currentUser;
      attempts++;
    }
  }

  async logout() {
    console.log('[AuthService] logout() chamado');
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  async forgotPassword(email: string) {
    console.log('[AuthService] forgotPassword() chamado com', { email });
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('[AuthService] Erro durante password reset:', error);
    }
  }

  isLoggedIn(): Observable<boolean> {
    console.log('[AuthService] isLoggedIn()');
    return this.afAuth.authState.pipe(map((user) => !!user));
  }

  getUser(): Observable<{
    displayName: string;
    email: string;
    firstName: string;
    photoURL: string;
  } | null> {
    console.log('[AuthService] getUser()');
    return this.afAuth.authState.pipe(
      map((user) => {
        if (!user) return null;
        const firstName = user.displayName?.split(' ')[0] || '';
        return {
          displayName: user.displayName || '',
          email: user.email || '',
          firstName: firstName || user.email || '',
          photoURL: user.photoURL || ''
        };
      })
    );
  }

  updateUserProfile(profileData: {
    displayName: string;
    email?: string;
    photoURL?: string;
    photoFile?: File;
  }): Observable<void> {
    console.log('[AuthService] updateUserProfile() chamado com', profileData);
    return new Observable((observer) => {
      this.afAuth.currentUser.then(async (user) => {
        if (!user) return observer.error('Usuário não autenticado');
        try {
          // 1) trocar e-mail
          if (profileData.email && profileData.email !== user.email) {
            await user.verifyBeforeUpdateEmail(profileData.email);
            observer.next();
            observer.complete();
            return;
          }

          // 2) upload de foto
          if (profileData.photoFile) {
            const filePath = `profile_images/${user.uid}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(filePath, profileData.photoFile);
            await task.snapshotChanges().pipe(
              finalize(async () => {
                const downloadURL = await fileRef.getDownloadURL().toPromise();
                await user.updateProfile({
                  displayName: profileData.displayName,
                  photoURL: downloadURL
                });
                await user.reload();
                // força o AngularFireAuth a reconhecer o usuário atualizado
                await this.afAuth.updateCurrentUser(user);
                observer.next();
                observer.complete();
              })
            ).toPromise();
          } else {
            // 3) apenas nome/photoURL
            await user.updateProfile({
              displayName: profileData.displayName,
              photoURL: profileData.photoURL || user.photoURL || ''
            });
            await user.reload();
            await this.afAuth.updateCurrentUser(user);
            observer.next();
            observer.complete();
          }
        } catch (err) {
          console.error('[AuthService] Erro em updateUserProfile():', err);
          observer.error(err);
        }
      });
    });
  }
}
