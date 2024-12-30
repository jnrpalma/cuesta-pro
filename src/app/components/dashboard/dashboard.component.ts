import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoButtonModule, PoChartModule, PoChartType, PoLoadingModule, PoAvatarModule, PoModalComponent } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PoChartModule, PoButtonModule, PoLoadingModule, PoAvatarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('confirmExitModal') confirmExitModal!: PoModalComponent;
  @ViewChild('photoModal') photoModal!: PoModalComponent;
  chartTypeLine: PoChartType = PoChartType.Line;
  chartTypePie: PoChartType = PoChartType.Pie;
  chartTypeColumn: PoChartType = PoChartType.Column;
  chartTypeDonut: PoChartType = PoChartType.Donut;
  chartTypeBar: PoChartType = PoChartType.Bar;
  userName: string = 'John Doe';
  profileImage: string = ''; 
  isLoading: boolean = false;
  isModalVisible = false;
  isPhotoModalVisible: boolean = false;
  selectedPhoto: File | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userName = user.displayName || user.email;
        this.profileImage = user.photoURL || ''; 
        console.log('User name set to:', this.userName);
        console.log('Profile image URL:', this.profileImage);
      } else {
        this.userName = '';
        this.profileImage = ''; 
      }
    });
  }
  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  confirmLogout() {
    this.closeModal();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/dashboard/${route}`]);
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
  

  openPhotoModal() {
    this.isPhotoModalVisible = true;
  }

  closePhotoModal() {
    this.isPhotoModalVisible = false;
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      console.log('Foto selecionada:', file.name);
    }
  }

  savePhoto() {
    if (this.selectedPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.selectedPhoto = null;
        this.closePhotoModal();
        console.log('Foto atualizada com sucesso!');
      };
      reader.readAsDataURL(this.selectedPhoto);
    }
  }

  removePhoto() {
    this.profileImage = '';
    this.closePhotoModal();
    console.log('Foto removida com sucesso!');
  }
}
