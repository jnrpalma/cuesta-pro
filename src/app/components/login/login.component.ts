import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule, PoNotificationService } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../services/error-handle/error-handle.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isForgotPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private poNotification: PoNotificationService,
    private errorHandleService: ErrorHandleService
  ) {
    this.authService.logout(); 
  }

  async onSubmit() {
    if (this.email && this.password) {
      this.isLoading = true;
      try {
        await this.authService.login(this.email, this.password);
      } catch (error) {
        this.errorHandleService.handleLoginError(error);  
      } finally {
        this.isLoading = false;
      }
    } else {
      this.poNotification.warning('Por favor, preencha todos os campos.');
    }
  }
  

  async onForgotPasswordSubmit() {
    if (this.email) {
      this.isLoading = true;
      try {
        await this.authService.forgotPassword(this.email);
        this.poNotification.success('Se o email estiver registrado, um link de redefinição de senha será enviado.');
      } catch (error) {
        this.errorHandleService.handleForgotPasswordError(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.poNotification.warning('Por favor, insira um email.');
    }
  }

  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
  }

  navigateToRegister() {
    this.showLoading();
    setTimeout(() => {
      this.router.navigate(['/register']);
      this.hideLoading();
    }, 1000); 
  }

  showLoading() {
    setTimeout(() => {
      this.isLoading = true;
    }, 300); 
  }

  hideLoading() {
    setTimeout(() => {
      this.isLoading = false;
    }, 300); 
  }
}
