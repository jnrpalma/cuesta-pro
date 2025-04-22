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
  // Obtenha o Router usando inject()
  private router: Router = inject(Router);

  constructor(
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    // Persistência de sessão
    this.afAuth.setPersistence('session');
  }

  /** Faz login e redireciona ao dashboard */
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
      const user = userCredential.user;
      if (!user) return;

      if (profileImage) {
        const filePath = `profile_images/${user.uid}`;
        const fileRef = this.storage.ref(filePath);
        const file = this.dataURLtoFile(profileImage, 'profileImage.png');
        const task = this.storage.upload(filePath, file);

        await task
          .snapshotChanges()
          .pipe(
            finalize(async () => {
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              console.log('[AuthService] Upload concluído, photoURL:', downloadURL);
              await user.updateProfile({
                displayName,
                photoURL: downloadURL
              });
              await this.syncUserProfileUpdate();
              this.router.navigate(['/dashboard/overview']);
            })
          )
          .toPromise();
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

  /** Converte dataURL em File */
  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  /** Garante que displayName e photoURL foram efetivamente atualizados */
  private async syncUserProfileUpdate() {
    let user = await this.afAuth.currentUser;
    let attempts = 0;
    while (
      user &&
      (!user.displayName || !user.photoURL) &&
      attempts < 5
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      user = await this.afAuth.currentUser;
      attempts++;
    }
  }

  /** Faz logout e redireciona ao login */
  async logout() {
    console.log('[AuthService] logout() chamado');
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  /** Envia e‑mail de redefinição de senha */
  async forgotPassword(email: string) {
    console.log('[AuthService] forgotPassword() chamado com', { email });
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('[AuthService] Password reset email enviado');
    } catch (error) {
      console.error('[AuthService] Erro durante password reset:', error);
    }
  }

  /** Emite true/false conforme usuário autenticado */
  isLoggedIn(): Observable<boolean> {
    console.log('[AuthService] isLoggedIn()');
    return this.afAuth.authState.pipe(map((user) => !!user));
  }

  /** Retorna dados simplificados do usuário */
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
        const firstName = user.displayName
          ? user.displayName.split(' ')[0]
          : '';
        return {
          displayName: user.displayName || '',
          email: user.email || '',
          firstName: firstName || user.email || '',
          photoURL: user.photoURL || ''
        };
      })
    );
  }

  /**
   * Atualiza displayName, photoURL ou e‑mail de login.
   * Se e‑mail mudou, faz updateEmail() primeiro.
   * Se houver photoFile, faz upload e atualiza photoURL.
   */
  updateUserProfile(profileData: {
    displayName: string;
    email?: string;
    photoURL?: string;
    photoFile?: File;
  }): Observable<void> {
    console.log('[AuthService] updateUserProfile() chamado com', profileData);
    return new Observable((observer) => {
      this.afAuth.currentUser.then(async (user) => {
        if (!user) {
          console.error('[AuthService] Nenhum usuário autenticado');
          return observer.error('Usuário não autenticado');
        }
        try {
          // 1) atualiza e‑mail de login se mudou
          if (profileData.email && profileData.email !== user.email) {
            console.log('[AuthService] Chamando user.updateEmail()', profileData.email);
            await user.updateEmail(profileData.email);
            console.log('[AuthService] updateEmail() OK:', user.email);
          } else {
            console.log('[AuthService] Email não alterado ou igual');
          }

          // 2) faz upload de foto se houver
          if (profileData.photoFile) {
            console.log('[AuthService] Fazendo upload de foto...');
            const filePath = `profile_images/${user.uid}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(
              filePath,
              profileData.photoFile
            );
            await task
              .snapshotChanges()
              .pipe(
                finalize(async () => {
                  const downloadURL = await fileRef
                    .getDownloadURL()
                    .toPromise();
                  console.log('[AuthService] Upload concluído, new photoURL:', downloadURL);
                  await user.updateProfile({
                    displayName: profileData.displayName,
                    photoURL: downloadURL
                  });
                  console.log('[AuthService] updateProfile() OK com nova foto');
                  observer.next();
                  observer.complete();
                })
              )
              .toPromise();
          } else {
            console.log('[AuthService] Atualizando apenas displayName/photoURL');
            await user.updateProfile({
              displayName: profileData.displayName,
              photoURL: profileData.photoURL || user.photoURL || ''
            });
            console.log('[AuthService] updateProfile() OK:', {
              displayName: user.displayName,
              photoURL: user.photoURL
            });
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
