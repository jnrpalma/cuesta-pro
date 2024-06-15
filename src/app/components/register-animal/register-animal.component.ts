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
    dataNascimento: null,  // Novo campo
    peso: 0,  // Novo campo
    raca: '',
    registradoPor: '',
    denticao: '',  // Novo campo
    quantity: 1,  // Novo campo
    paiAnimal: 'proprio', // Modificado para string
    nomePai: '', // Novo campo
    maeAnimal: 'proprio', // Modificado para string
    nomeMae: '' // Novo campo
  };
  
  isLoading = false;
  loggedInUser: string = '';

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
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date', gridColumns: 6, required: true },
    { property: 'peso', label: 'Peso', type: 'number', gridColumns: 6, required: true },  // Novo campo
    { property: 'data', label: 'Data de Registro', type: 'date', gridColumns: 6, required: true },
    { 
      property: 'denticao', 
      label: 'Dentição', 
      type: 'select', 
      gridColumns: 6, 
      options: [
        { label: 'Dente de Leite', value: 'denteDeLeite' },
        { label: 'Dois Dentes', value: 'doisDentes' },
        { label: 'Quatro Dentes', value: 'quatroDentes' },
        { label: 'Seis Dentes', value: 'seisDentes' },
        { label: 'Oito Dentes', value: 'oitoDentes' },
        { label: 'Zero Dentes', value: 'zeroDentes' }
      ]
    },
    { property: 'registradoPor', label: 'Registrado por', gridColumns: 6, disabled: true },
    { property: 'quantity', label: 'Quantidade de Registros', type: 'number', gridColumns: 6, required: true },
    { 
      property: 'paiAnimal', 
      label: 'O pai é um animal da sua fazenda ou de terceiro?', 
      type: 'radioGroup', 
      options: [
        { label: 'Animal Próprio', value: 'proprio' },
        { label: 'Animal de Terceiro', value: 'terceiro' }
      ],
      gridColumns: 12,
      required: true 
    },
    { property: 'nomePai', label: 'Nome do pai', gridColumns: 12, required: true },
    { 
      property: 'maeAnimal', 
      label: 'A mãe é um animal da sua fazenda ou de terceiro?', 
      type: 'radioGroup', 
      options: [
        { label: 'Animal Próprio', value: 'proprio' },
        { label: 'Animal de Terceiro', value: 'terceiro' }
      ],
      gridColumns: 12,
      required: true 
    },
    { property: 'nomeMae', label: 'Nome da mãe', gridColumns: 12, required: true }
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
    this.animal.data = new Date(); // Definindo a data atual como Data de Registro
  }

  cadastrar() {
    if (!this.camposValidos()) {
      this.poNotification.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    const animalsToRegister = Array.from({ length: this.animal.quantity }, () => ({ ...this.animal }));

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
           this.animal.data !== null &&  // Validação para Data de Registro
           this.animal.dataNascimento !== null &&  // Validação para Data de Nascimento
           (this.animal.peso ?? 0) > 0 &&  // Validação para Peso, garantindo que peso não seja null
           this.animal.raca !== '' &&
           this.animal.denticao !== '' &&  // Validação para Dentição
           this.animal.nomePai !== '' &&  // Validação para Nome do Pai
           this.animal.nomeMae !== '';  // Validação para Nome da Mãe
  }

  limparFormulario() {
    this.animal = {
      id: '',
      genero: '',
      categoria: '',
      data: new Date(), // Definindo a data atual como Data de Registro
      dataNascimento: null,  // Novo campo
      peso: 0,  // Novo campo
      raca: '',
      registradoPor: this.loggedInUser, // Mantenha o usuário logado no novo cadastro
      denticao: '',  // Novo campo
      quantity: 1,  // Novo campo
      paiAnimal: 'proprio', // Modificado para string
      nomePai: '', // Novo campo
      maeAnimal: 'proprio', // Modificado para string
      nomeMae: '' // Novo campo
    };
  }

  restaurar() {
    this.limparFormulario();
  }
}




