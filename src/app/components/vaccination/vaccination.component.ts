import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoNotificationService,
  PoTableColumn,
  PoTableModule,
  PoModalModule,
  PoFieldModule,
  PoSelectOption
} from '@po-ui/ng-components';
import { VaccinationService } from '../../services/vaccination/vaccination.service';
import { AnimalService } from '../../services/animal/animal.service';

@Component({
  selector: 'app-vaccination',
  standalone: true,
  imports: [CommonModule, FormsModule, PoTableModule, PoButtonModule, PoModalModule, PoFieldModule],
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {
  animals: PoSelectOption[] = []; // Lista de opções para o po-select
  animalsMap: { [firestoreId: string]: any } = {}; // Mapa de firestoreId para animal completo
  vaccinations: any[] = [];
  
  selectedAnimal: any = null;
  selectedAnimalFirestoreId: string | null = null; // Armazena apenas o ID para o ngModel do po-select

  vaccinationDate: string = '';
  vaccineName: string = '';
  observation: string = '';
  dose: string = '';

  doseOptions: PoSelectOption[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: 'Dose Única', value: 'dose_unica' }
  ];

  columns: PoTableColumn[] = [
    { property: 'animalName', label: 'Animal' },
    { property: 'vaccineName', label: 'Vacina' },
    { property: 'dose', label: 'Dose' },
    { property: 'date', label: 'Data de Aplicação' },
    { property: 'observation', label: 'Observações' },
  ];

  constructor(
    private vaccinationService: VaccinationService,
    private animalService: AnimalService,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.loadAnimals();
    this.loadVaccinations();
  }

  loadAnimals() {
    this.animalService.getAllAnimals().subscribe(animals => {
      console.log('Animais carregados do Firestore:', animals);
  
      this.animalsMap = {};
      this.animals = animals.map(a => {
        // Garantimos ao TypeScript que firestoreId não é nulo/undefined
        const fid = a.firestoreId!;
        
        // Populamos o mapa com o objeto do animal completo
        this.animalsMap[fid] = a;
        
        // Retornamos um PoSelectOption, garantindo que value seja string
        return {
          label: a.id,     // nome amigável (brinco)
          value: fid       // firestoreId como identificador único
        } as PoSelectOption;
      });
  
      console.log('Opções do select (this.animals):', this.animals);
      console.log('Mapa de animais (this.animalsMap):', this.animalsMap);
    });
  }
  

  loadVaccinations() {
    this.vaccinationService.getVaccinations().subscribe(vaccinations => {
      this.vaccinations = vaccinations;
      console.log('Vacinações carregadas:', this.vaccinations);
    });
  }

  onAnimalChange(firestoreId: string) {
    console.log('Evento onAnimalChange disparado, valor selecionado:', firestoreId);
    this.selectedAnimalFirestoreId = firestoreId;
    this.selectedAnimal = this.animalsMap[firestoreId];
    console.log('Animal selecionado (this.selectedAnimal):', this.selectedAnimal);
  }

  applyVaccination() {
    console.log('Tentando aplicar vacinação...');
    console.log('Animal selecionado no momento da aplicação:', this.selectedAnimal);
    console.log('Dados da vacinação:', {
      vaccineName: this.vaccineName,
      vaccinationDate: this.vaccinationDate,
      dose: this.dose,
      observation: this.observation
    });

    if (!this.selectedAnimal || !this.selectedAnimal.firestoreId || !this.vaccineName || !this.vaccinationDate || !this.dose) {
      this.poNotification.warning('Por favor, preencha todos os campos para registrar a vacinação.');
      console.log('Falha na validação dos campos.');
      return;
    }

    const vaccination = {
      animalId: this.selectedAnimal.firestoreId,
      animalName: this.selectedAnimal.id,
      vaccineName: this.vaccineName,
      dose: this.dose,
      date: this.vaccinationDate,
      observation: this.observation
    };

    console.log('Objeto de vacinação que será salvo:', vaccination);

    this.vaccinationService.applyVaccination(vaccination)
      .then(() => {
        this.poNotification.success('Vacinação registrada com sucesso!');
        console.log('Vacinação registrada com sucesso no Firestore.');
        this.loadVaccinations();
      })
      .catch((error: any) => {
        this.poNotification.error('Erro ao registrar a vacinação.');
        console.error('Erro ao registrar a vacinação:', error);
      });
  }
}
