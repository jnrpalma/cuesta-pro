import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule, PoNotificationService, PoLoadingModule, PoTableModule, PoTableColumn } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { AuthService } from '../../services/auth/auth.service';
import { Animal } from './interface/animal.interface';


@Component({
  selector: 'app-register-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PoButtonModule, PoDynamicModule, PoLoadingModule, PoTableModule],
  templateUrl: './register-animal.component.html',
  styleUrls: ['./register-animal.component.css']
})
export class RegisterAnimalComponent implements OnInit {
  animal: Animal = {
    id: '',
    genero: '',
    categoria: '',
    data: null,
    raca: '',
    registradoPor: ''
  };
  
  isLoading = false;
  loggedInUser: string = '';
  animals: Animal[] = [];

  fields: Array<PoDynamicFormField> = [
    { property: 'id', label: 'ID animal', gridColumns: 3, required: true },
    { 
      property: 'genero', 
      label: 'Gênero', 
      gridColumns: 3, 
      required: true,
      options: [
        { label: 'Macho', value: 'M' },
        { label: 'Fêmea', value: 'F' },
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
        { label: 'Ovelha', value: 'ovelha' },
        { label: 'Borrego', value: 'borrego' },
        { label: 'Cordeiro', value: 'cordeiro' },
        { label: 'Carneiro', value: 'carneiro' },
        { label: 'Rufião', value: 'rufiao' },
      ]
    },
    { 
      property: 'raca', 
      label: 'Raça', 
      gridColumns: 3, 
      required: true,
      options: [
        { label: 'Santa Inês', value: 'santaInes' },
        { label: 'Morada Nova2', value: 'moradaNova' },
        { label: 'Suffolk', value: 'suffolk' },
        { label: 'Bergamácia', value: 'bergamacia' },
        { label: 'Hampshire Down', value: 'hampshireDown' },
        { label: 'Poll Dorset', value: 'pollDorset' },
        { label: 'Dorper', value: 'dorper' },
        { label: 'White Dorper', value: 'whiteDorper' },
        { label: 'Somalis Brasileira', value: 'somalisBrasileira' },
        { label: 'Sem raça definida', value: 'semRacaDefinida' },
      ]
    },
    { property: 'data', label: 'Data', type: 'date', gridColumns: 12, required: true },
    { property: 'registradoPor', label: 'Registrado por', gridColumns: 12, disabled: true }
  ];

  columns: PoTableColumn[] = [
    { property: 'id', label: 'ID' },
    { property: 'genero', label: 'Gênero' },
    { property: 'categoria', label: 'Categoria' },
    { property: 'raca', label: 'Raça' },
    { property: 'data', label: 'Data', type: 'date' },
    { property: 'registradoPor', label: 'Registrado por' }
  ];

  constructor(
    private animalService: AnimalService,
    private authService: AuthService,
    private router: Router,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.loggedInUser = user.displayName; // ou user.displayName, dependendo do que é retornado
        this.animal.registradoPor = this.loggedInUser;
      }
    });

    this.loadAnimals();
  }

  loadAnimals() {
    this.animalService.getAnimals().subscribe((data: Animal[]) => {
      this.animals = data;
    }, error => {
      console.error('Erro ao carregar animais:', error);
    });
  }

  cadastrar() {
    if (!this.camposValidos()) {
      this.poNotification.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    console.log('Dados do animal a serem cadastrados:', this.animal);
    this.animalService.addAnimal(this.animal).then(() => {
      console.log('Animal cadastrado:', this.animal);
      this.poNotification.success('Animal cadastrado com sucesso!'); // Exibe a notificação de sucesso
      this.limparFormulario(); // Limpa os campos do formulário
      this.loadAnimals(); // Recarrega a lista de animais
      this.isLoading = false;
    }).catch(error => {
      console.log('Erro ao cadastrar animal:', error);
      this.poNotification.error('Erro ao cadastrar animal!'); // Exibe a notificação de erro
      this.isLoading = false;
    });
  }

  camposValidos(): boolean {
    return this.animal.id !== '' &&
           this.animal.genero !== '' &&
           this.animal.categoria !== '' &&
           this.animal.data !== null &&
           this.animal.raca !== '';
  }

  limparFormulario() {
    this.animal = {
      id: '',
      genero: '',
      categoria: '',
      data: null,
      raca: '',
      registradoPor: this.loggedInUser // Mantenha o usuário logado no novo cadastro
    };
  }

  restaurar() {
    this.limparFormulario();
  }
}
