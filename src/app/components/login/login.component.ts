import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    if (this.email && this.password) {
      this.http.get<any[]>(`http://localhost:3000/users?email=${this.email}`).subscribe(users => {
        if (users.length > 0 && users[0].password === this.password) {
          console.log('Login successful');
          this.router.navigate(['/dashboard']);
        } else {
          console.log('Invalid email or password');
        }
      });
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
