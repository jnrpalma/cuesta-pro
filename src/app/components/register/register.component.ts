import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule, PoAvatarModule, PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../services/error-handle/error-handle.service';

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

  // Novas variáveis de validação de senha
  hasLowercase: boolean = false;
  hasUppercase: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;
  hasMinLength: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private poNotification: PoNotificationService,
    private errorHandleService: ErrorHandleService
  ) {}

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

  // Função para validar a força da senha
  validatePassword() {
    const password = this.password;
    this.hasLowercase = /[a-z]/.test(password);
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSpecialChar = /[!@#$%^&*]/.test(password);
    this.hasMinLength = password.length >= 8;
  }

  // Função para verificar se o formulário é válido
  isFormValid(): boolean {
    return this.hasLowercase && this.hasUppercase && this.hasNumber && this.hasSpecialChar && this.hasMinLength && this.password === this.confirmPassword;
  }

  async onSubmit() {
    if (this.firstName && this.email && this.password && this.password === this.confirmPassword) {
      this.isLoading = true;
      try {
        const displayName = this.firstName;
        await this.authService.register(this.email, this.password, displayName, this.profileImage);
        this.poNotification.success('Registro realizado com sucesso!');
      } catch (error) {
        this.errorHandleService.handleRegistrationError(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.poNotification.warning('Por favor, preencha todos os campos corretamente.');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}