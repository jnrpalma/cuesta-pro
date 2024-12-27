import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { PoAvatarModule, PoButtonModule, PoFieldModule, PoLinkModule, PoLoadingModule, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ErrorHandleService } from '../../services/error-handle/error-handle.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule, PoAvatarModule],
schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('passwordValidationModal') passwordValidationModal!: PoModalComponent;

  firstName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profileImage: string = '';
  fileName: string = 'Nenhum arquivo escolhido';
  isLoading: boolean = false;

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

  validatePassword() {
    const password = this.password;
    this.hasLowercase = /[a-z]/.test(password);
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    this.hasMinLength = password.length >= 8;
  }

  isFormValid(): boolean {
    return (
      this.hasLowercase &&
      this.hasUppercase &&
      this.hasNumber &&
      this.hasSpecialChar &&
      this.hasMinLength &&
      this.password === this.confirmPassword
    );
  }

  async onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      try {
        await this.authService.register(this.email, this.password, this.firstName, this.profileImage);
        this.poNotification.success('Registro realizado com sucesso!');
        this.router.navigate(['/login']);
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

  openPasswordValidationModal() {
    this.passwordValidationModal.open();
  }

  closePasswordValidationModal() {
    this.passwordValidationModal.close();
  }
}
