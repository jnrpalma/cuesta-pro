import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule, PoAvatarModule } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule, PoAvatarModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profileImage: string = ''; // Nova propriedade para armazenar a imagem de perfil
  fileName: string = 'Nenhum arquivo escolhido'; // Nome do arquivo escolhido
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.fileName = file.name;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  async onSubmit() {
    if (this.firstName && this.email && this.password && this.password === this.confirmPassword) {
      this.isLoading = true;
      try {
        const displayName = this.firstName;
        await this.authService.register(this.email, this.password, displayName, this.profileImage);
      } catch (error) {
        console.log('Error during registration:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log('Please fill all fields correctly');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
