import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoButtonModule, PoAvatarModule, PoModalComponent } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PoButtonModule, PoAvatarModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('confirmExitModal') confirmExitModal!: PoModalComponent;
  userName: string = 'John Doe';
  profileImage: string = ''; 
  isModalVisible = false;
  isProfileModalVisible: boolean = false;
  selectedPhoto: File | null = null;

  profileData = {
    name: '',
    email: '',
    phone: '',
    photoURL: ''
  };

  constructor(private authService: AuthService, private router: Router,private cdr :ChangeDetectorRef ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userName = user.displayName || user.email;
        this.profileImage = user.photoURL || '';
        this.profileData = {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phone || '',
          photoURL: user.photoURL || ''
        };
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

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  openProfileModal() {
    this.isProfileModalVisible = true;
  }

  closeProfileModal() {
    this.isProfileModalVisible = false;
  }

  

  isSaving: boolean = false;

  saveProfile() {
    this.isSaving = true; 
  
    const updatedProfile: { displayName: string; photoFile?: File; photoURL?: string } = {
      displayName: this.profileData.name,
    };
  
    if (this.selectedPhoto) {
      updatedProfile.photoFile = this.selectedPhoto;
    } else {
      updatedProfile.photoURL = this.profileData.photoURL;
    }
  
    this.authService.updateUserProfile(updatedProfile).subscribe({
      next: () => {
        console.log('Perfil atualizado com sucesso!');
        this.isSaving = false; // Para o indicador de carregamento
        this.closeProfileModal();
      },
      error: (error) => {
        console.error('Erro ao atualizar perfil:', error);
        this.isSaving = false; // Para o indicador mesmo com erro
      },
    });
  }
  
  
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
     
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;  
        
        this.profileData.photoURL = this.profileImage;
        this.cdr.detectChanges();  
      };
      reader.readAsDataURL(file); 
    }
  }

  removePhoto() {
    this.profileImage = '';
    this.profileData.photoURL = '';
  }
  navigateTo(route: string): void {
    this.router.navigate([`/dashboard/${route}`]);
  }
}
