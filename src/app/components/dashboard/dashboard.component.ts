import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  PoAvatarModule,
  PoButtonModule,
  PoFieldModule,
  PoModalComponent,
  PoModalModule,
  PoLoadingModule,
  PoNotificationModule,
  PoNotificationService
} from '@po-ui/ng-components';

import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PoAvatarModule,
    PoButtonModule,
    PoFieldModule,
    PoModalModule,
    PoLoadingModule,
    PoNotificationModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('profileModal', { static: true })
  profileModal!: PoModalComponent;
  @ViewChild('confirmExitModal', { static: true })
  confirmExitModal!: PoModalComponent;

  userName = 'John Doe';
  profileImage = '';
  fileName = 'Nenhum arquivo escolhido';
  selectedPhoto: File | null = null;
  isSaving = false;
  notificationsVisible = false;

  profileData = {
    name: '',
    email: '',
    photoURL: ''
  };

  private originalEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notification: PoNotificationService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.userName = user.firstName;
        this.profileImage = user.photoURL;
        this.profileData = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        this.originalEmail = user.email;
      }
    });
  }

  openProfileModal() {
    this.profileModal.open();
  }

  closeProfileModal() {
    this.profileModal.close();
  }

  triggerFileInput() {
    (document.getElementById('profileFileInput') as HTMLInputElement).click();
  }

  onPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.selectedPhoto = file;
    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result as string;
      this.profileData.photoURL = this.profileImage;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    this.isSaving = true;

    const updatedProfile: {
      displayName: string;
      email?: string;
      photoFile?: File;
      photoURL?: string;
    } = {
      displayName: this.profileData.name,
      email: this.profileData.email
    };

    if (this.selectedPhoto) {
      updatedProfile.photoFile = this.selectedPhoto;
    } else {
      updatedProfile.photoURL = this.profileData.photoURL;
    }

    this.authService
      .updateUserProfile(updatedProfile)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          // troca de e-mail
          if (
            updatedProfile.email &&
            updatedProfile.email !== this.originalEmail
          ) {
            this.notification.success({
              message:
                'Você foi desconectado. Enviamos um link de confirmação para o novo e-mail. Após confirmar, faça login com seu novo e-mail.'
            });
            this.authService.logout().then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            // atualização de nome/foto
            this.userName = this.profileData.name;
            this.profileImage = this.profileData.photoURL;
            this.closeProfileModal();
            this.notification.success({
              message: 'Perfil atualizado com sucesso!'
            });
          }
        },
        error: (err) => {
          if (err.code === 'auth/requires-recent-login') {
            this.notification.warning({
              message:
                'Para alterar o e-mail, faça logout e login novamente antes de tentar.'
            });
          } else {
            this.notification.error({
              message: 'Erro ao atualizar perfil. Tente novamente.'
            });
          }
        }
      });
  }

  openNotifications() {
    this.notificationsVisible = !this.notificationsVisible;
  }

  openModal() {
    this.confirmExitModal.open();
  }

  closeModal() {
    this.confirmExitModal.close();
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }

  navigateTo(route: string) {
    this.router.navigate([`/dashboard/${route}`]);
  }
}
