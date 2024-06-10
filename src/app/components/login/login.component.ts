import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoFieldModule, PoButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isForgotPassword: boolean = false;

  onSubmit() {
    if (this.email && this.password) {
      // Lógica de autenticação aqui
      console.log('Login successful');
    } else {
      console.log('Please enter email and password');
    }
  }

  onForgotPasswordSubmit() {
    if (this.email) {
      // Lógica de envio de e-mail de recuperação de senha
      console.log('Password recovery email sent');
    } else {
      console.log('Please enter email');
    }
  }

  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
  }
}
