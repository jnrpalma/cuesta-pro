import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoDynamicModule, PoDynamicFormField, PoFieldModule, PoButtonModule, PoLoadingModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-register-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PoFieldModule, PoButtonModule, PoDynamicModule, PoLoadingModule],
  templateUrl: './register-animal.component.html',
  styleUrls: ['./register-animal.component.css']
})
export class RegisterAnimalComponent {
  fields: Array<PoDynamicFormField> = [
    { property: 'id', label: 'ID animal', gridColumns: 3, required: true },
    { property: 'genero', label: 'Gênero', gridColumns: 3, required: true },
    { property: 'categoria', label: 'Categoria', gridColumns: 3, required: true },
    { property: 'raca', label: 'Raça', gridColumns: 3, required: true },
    { property: 'data', label: 'Data', type: 'date', gridColumns: 12, required: true }
  ];

  animal = {
    id: '',
    genero: '',
    categoria: '',
    data: null,
    raca: ''
  };

  constructor(private router: Router) {}

  cadastrar() {
    console.log('Animal cadastrado:', this.animal);
    // Adicione a lógica de cadastro aqui
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
