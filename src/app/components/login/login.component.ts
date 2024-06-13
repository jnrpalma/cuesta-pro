import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isForgotPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.logout(); 
  }

  async onSubmit() {
    if (this.email && this.password) {
      this.isLoading = true; 
      try {
        await this.authService.login(this.email, this.password);
      } finally {
        this.isLoading = false; 
      }
    } else {
      console.log('Erro de email e senha');
    }
  }

  async onForgotPasswordSubmit() {
    if (this.email) {
      this.isLoading = true;
      try {
        await this.authService.forgotPassword(this.email);
        console.log('Se o email estiver registrado, um link de redefinição de senha será enviado.');
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log('Por favor, insira um email');
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
