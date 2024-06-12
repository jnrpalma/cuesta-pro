import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoFieldModule, PoButtonModule, PoLoadingModule, PoLinkModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (this.firstName && this.lastName && this.email && this.password && this.password === this.confirmPassword) {
      this.isLoading = true;
      try {
        const displayName = `${this.firstName} ${this.lastName}`;
        console.log('Registering user with displayName:', displayName); // Log do displayName
        await this.authService.register(this.email, this.password, displayName);
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
