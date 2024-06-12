import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoFieldModule, PoButtonModule, PoLoadingModule } from '@po-ui/ng-components';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PoFieldModule, PoButtonModule, PoLoadingModule],
  templateUrl: './register-animal.component.html',
  styleUrls: ['./register-animal.component.css']
})
export class RegisterAnimalComponent  {
  animal = {
    id: '',
    genero: '',
    categoria: '',
    data: null,
    raca: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    // Implementar lógica de cadastro
    console.log('Animal cadastrado:', this.animal);
  }

  restaurar() {
    this.animal = {
      id: '',
      genero: '',
      categoria: '',
      data: null,
      raca: ''
    };
  }
}
