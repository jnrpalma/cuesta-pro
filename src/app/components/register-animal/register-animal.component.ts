import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
 // Certifique-se de ajustar o caminho para o serviço corretamente

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
