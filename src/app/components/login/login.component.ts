import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule, PoLoadingModule } from '@po-ui/ng-components';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoFieldModule, PoButtonModule, PoLoadingModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isForgotPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.logout(); // Desloga o usuário ao iniciar o componente
  }

  onSubmit() {
    if (this.email && this.password) {
      this.isLoading = true; // Mostrar o loading
      this.authService.login(this.email, this.password).finally(() => {
        this.isLoading = false; // Esconder o loading
      });
    } else {
      console.log('Please enter email and password');
    }
  }

  onForgotPasswordSubmit() {
    if (this.email) {
      this.authService.forgotPassword(this.email);
    } else {
      console.log('Please enter email');
    }
  }

  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
  }
}
