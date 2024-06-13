import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule, PoNotificationService, PoLoadingModule, PoFieldModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { AuthService } from '../../services/auth/auth.service';
import { Animal } from './interface/animal.interface';

@Component({
  selector: 'app-register-animal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PoButtonModule, PoDynamicModule,PoFieldModule , PoLoadingModule],
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
  quantity: number = 1;

  fields: Array<PoDynamicFormField> = [
    { property: 'id', label: 'ID Brinco', gridColumns: 3, required: true },
    { 
      property: 'genero', 
      label: 'Gênero', 
      gridColumns: 3, 
      required: true,
      options: [
        { label: 'Macho', value: 'MACHO' },
        { label: 'Fêmea', value: 'FEMEA' },
        { label: 'Outros', value: 'OUTROS' },
        { label: 'N/A', value: 'N/A' },
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
        { label: 'Morada Nova', value: 'moradaNova' },
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

  constructor(
    private animalService: AnimalService, 
    private authService: AuthService, 
    private router: Router,
    private poNotification: PoNotificationService 
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.loggedInUser = user.displayName || user.email;
        this.animal.registradoPor = this.loggedInUser;
      }
    });
    this.animal.data = new Date(); // Definindo a data atual
  }

  cadastrar() {
    if (!this.camposValidos()) {
      this.poNotification.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    const animalsToRegister = Array.from({ length: this.quantity }, () => ({ ...this.animal }));

    const promises = animalsToRegister.map(animal => this.animalService.addAnimal(animal));

    Promise.all(promises).then(() => {
      this.poNotification.success('Todos os animais foram cadastrados com sucesso!');
      this.limparFormulario();
      this.isLoading = false;
    }).catch(error => {
      console.log('Erro ao cadastrar animais:', error);
      this.poNotification.error('Erro ao cadastrar alguns animais!');
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
      data: new Date(), // Definindo a data atual
      raca: '',
      registradoPor: this.loggedInUser // Mantenha o usuário logado no novo cadastro
    };
    this.quantity = 1;
  }

  restaurar() {
    this.limparFormulario();
  }
}
