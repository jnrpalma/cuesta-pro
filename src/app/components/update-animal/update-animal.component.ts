import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from '../../services/animal/animal.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { PoNotificationService } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule, PoLoadingModule } from '@po-ui/ng-components';

@Component({
    selector: 'app-update-animal',
    imports: [CommonModule, FormsModule, PoButtonModule, PoDynamicModule, PoLoadingModule],
    templateUrl: './update-animal.component.html',
    styleUrls: ['./update-animal.component.css']
})
export class UpdateAnimalComponent implements OnInit {
  animalId!: string;
  animal: Animal = {} as Animal;
  isLoading: boolean = false;

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
    { property: 'peso', label: 'Peso', type: 'number', gridColumns: 6, required: true },
    { 
      property: 'denticao', 
      label: 'Dentição', 
      type: 'select', 
      gridColumns: 6, 
      options: [
        { label: 'Dente de Leite', value: 'denteDeLeite' },
        { label: 'Dois Dentes', value: '2Dentes' },
        { label: 'Quatro Dentes', value: '4Dentes' },
        { label: 'Seis Dentes', value: '6Dentes' },
        { label: 'Oito Dentes', value: '8Dentes' },
        { label: 'Zero Dentes', value: '0Dentes' }
      ]
    },
  ];

  paiFields: Array<PoDynamicFormField> = [
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
    { property: 'nomePai', label: 'Nome do pai', gridColumns: 12, required: true }
  ];

  maeFields: Array<PoDynamicFormField> = [
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
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.animalId = params['id'];
      this.loadAnimal();
    });
  }

  loadAnimal(): void {
    this.isLoading = true;
    this.animalService.getAnimalById(this.animalId).subscribe((animal: Animal) => {
      this.animal = animal;
      this.isLoading = false;
    });
  }

  atualizar() {
    if (!this.camposValidos()) {
      this.poNotification.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    this.animalService.updateAnimal(this.animal).then(() => {
      this.poNotification.success('Animal atualizado com sucesso!');
      this.router.navigate(['/dashboard/animais']);
      this.isLoading = false;
    }).catch(error => {
      this.poNotification.error('Erro ao atualizar o animal: ' + error.message);
      this.isLoading = false;
    });
  }

  camposValidos(): boolean {
    return this.animal.id !== '' &&
           this.animal.genero !== '' &&
           this.animal.categoria !== '' &&
           this.animal.dataNascimento !== null &&
           (this.animal.peso ?? 0) > 0 &&
           this.animal.raca !== '' &&
           this.animal.denticao !== '' &&
           this.animal.nomePai !== '' &&
           this.animal.nomeMae !== '';
  }

  restaurar() {
    this.loadAnimal();
  }
}
