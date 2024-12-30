import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoButtonModule, PoModalComponent, PoModalModule, PoAvatarModule } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PoButtonModule,
    PoModalModule,
    PoAvatarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('confirmExitModal') confirmExitModal!: PoModalComponent;
  @ViewChild('photoModal') photoModal!: PoModalComponent;

  userName: string = 'John Doe';
  profileImage: string = '';
  isLoading: boolean = false;
  selectedPhoto: File | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userName = user.displayName || user.email;
        this.profileImage = user.photoURL || '';
      } else {
        this.userName = '';
        this.profileImage = '';
      }
    });
  }

  openModal() {
    this.confirmExitModal.open();
  }

  closeModal() {
    this.confirmExitModal.close();
  }

  openPhotoModal() {
    this.photoModal.open();
  }

  closePhotoModal() {
    this.photoModal.close();
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
    }
  }

  savePhoto() {
    if (this.selectedPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.selectedPhoto = null;
        this.closePhotoModal();
      };
      reader.readAsDataURL(this.selectedPhoto);
    }
  }

  confirmLogout() {
    this.closeModal();
    this.logout();
  }

  logout() {
    this.isLoading = true;
    this.authService.logout().then(() => {
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      }, 1000);
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/dashboard/${route}`]);
  }
}
