import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';

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
    this.afAuth.setPersistence('session');
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/dashboard/overview']);
    } catch (error) {
      console.log('Erro de login:', error);
      throw error;
    }
  }

  async register(email: string, password: string, displayName: string, profileImage: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        if (profileImage) {
          const filePath = `profile_images/${userCredential.user.uid}`;
          const fileRef = this.storage.ref(filePath);
          const file = this.dataURLtoFile(profileImage, 'profileImage.png');
  
          const task = this.storage.upload(filePath, file);
          
          // Aguardar o upload completar e buscar a URL
          await task.snapshotChanges().pipe(
            finalize(async () => {
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              await userCredential.user?.updateProfile({
                displayName: displayName,
                photoURL: downloadURL
              });
              await this.syncUserProfileUpdate();
              this.router.navigate(['/dashboard/overview']);
            })
          ).toPromise();
        } else {
          await userCredential.user.updateProfile({
            displayName: displayName
          });
          await this.syncUserProfileUpdate();
          this.router.navigate(['/dashboard/overview']);
        }
      }
    } catch (error) {
      console.log('Erro durante o registro:', error);
      throw error;
    }
  }
  
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
            firstName: firstName || user.email,
            photoURL: user.photoURL
          };
        } else {
          return null;
        }
      })
    );
  }
  
  updateUserProfile(profileData: { displayName: string; photoURL?: string; photoFile?: File }): Observable<void> {
    return new Observable((observer) => {
      this.afAuth.currentUser.then(async (user) => {
        if (user) {
          try {
            if (profileData.photoFile) {
              const filePath = `profile_images/${user.uid}`;
              const fileRef = this.storage.ref(filePath);
  
              const task = this.storage.upload(filePath, profileData.photoFile);
              
              await task.snapshotChanges().pipe(
                finalize(async () => {
                  const downloadURL = await fileRef.getDownloadURL().toPromise();
                  await user.updateProfile({
                    displayName: profileData.displayName,
                    photoURL: downloadURL,
                  });
                  observer.next();
                  observer.complete();
                  console.log('Perfil atualizado com imagem!');
                })
              ).toPromise();
            } else {
              await user.updateProfile({
                displayName: profileData.displayName,
                photoURL: profileData.photoURL || user.photoURL || '',
              });
              observer.next();
              observer.complete();
              console.log('Perfil atualizado sem alterar a imagem!');
            }
          } catch (error) {
            observer.error('Erro ao atualizar o perfil: ' + error);
          }
        } else {
          observer.error('Usuário não autenticado');
        }
      });
    });
  }
}
