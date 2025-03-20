import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule, PoAvatarModule, PoTooltipModule, PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../services/error-handle/error-handle.service';

@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PoFieldModule,
        PoButtonModule,
        PoLoadingModule,
        PoLinkModule,
        PoAvatarModule,
        PoTooltipModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profileImage: string = ''; 
  fileName: string = 'Nenhum arquivo escolhido'; 
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private poNotification: PoNotificationService,
    private errorHandleService: ErrorHandleService
  ) {}

  get passwordPattern(): string {
    return this.password === this.confirmPassword ? '.*' : '^$';
  }

  isFormValid(): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return (
      this.firstName.trim() !== '' &&
      this.email.trim() !== '' &&
      this.password.trim() !== '' &&
      this.confirmPassword.trim() !== '' &&
      this.password === this.confirmPassword &&
      passwordRegex.test(this.password)
    );
  }

  async onSubmit() {
    if (this.isFormValid()) {
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
