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
  PoLoadingModule
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
    PoLoadingModule
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      console.log('[Dashboard] getUser() subscribe:', user);
      if (user) {
        this.userName = user.firstName;
        this.profileImage = user.photoURL;
        this.profileData = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
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
    const input = document.getElementById(
      'profileFileInput'
    ) as HTMLInputElement;
    input.click();
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
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

  removePhoto() {
    this.selectedPhoto = null;
    this.profileImage = '';
    this.profileData.photoURL = '';
    this.fileName = 'Nenhum arquivo escolhido';
  }

  saveProfile() {
    console.log('[Dashboard] saveProfile() chamado com', this.profileData);
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
          console.log('[Dashboard] updateUserProfile() sucesso');
          this.userName = this.profileData.name;
          this.profileImage = this.profileData.photoURL;
          this.closeProfileModal();
        },
        error: (err) => {
          console.error('[Dashboard] updateUserProfile() erro:', err);
          if (err.code === 'auth/requires-recent-login') {
            alert(
              'Para alterar o e‑mail, faça logout e login novamente antes de tentar.'
            );
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
