import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';

@Component({
  selector: 'app-register-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PoButtonModule, PoDynamicModule],
  templateUrl: './register-animal.component.html',
  styleUrls: ['./register-animal.component.css']
})
export class RegisterAnimalComponent {
  fields: Array<PoDynamicFormField> = [
    { property: 'id', label: 'ID animal', gridColumns: 3, required: true },
    { 
      property: 'genero', 
      label: 'Gênero', 
      gridColumns: 3, 
      required: true,
      options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Outros', value: 'O' },
        { label: 'N/A', value: 'N' },
      ]
    },
    { 
      property: 'categoria', 
      label: 'Categoria', 
      gridColumns: 3, 
      required: true,
      options: [
        { label: 'Mamífero', value: 'mamifero' },
        { label: 'Ave', value: 'ave' },
        { label: 'Réptil', value: 'reptil' },
        { label: 'ovelha', value: 'ovino' }
      ]
    },
    { 
      property: 'raca', 
      label: 'Raça', 
      gridColumns: 3, 
      required: true,
      options: [
        { label: 'Raça 1', value: 'raca1' },
        { label: 'Raça 2', value: 'raca2' },
        { label: 'Raça 3', value: 'raca3' },
        { label: 'Raça 4', value: 'raca4' },
      ]
    },
    { property: 'data', label: 'Data', type: 'date', gridColumns: 12, required: true }
  ];

  animal = {
    id: '',
    genero: '',
    categoria: '',
    data: null,
    raca: ''
  };

  constructor(private animalService: AnimalService, private router: Router) {}

  cadastrar() {
    console.log('Dados do animal a serem cadastrados:', this.animal);
    this.animalService.addAnimal(this.animal).then(() => {
      console.log('Animal cadastrado:', this.animal);
      // Adicione a lógica para redirecionar ou mostrar uma mensagem de sucesso
    }).catch(error => {
      console.log('Erro ao cadastrar animal:', error);
    });
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
