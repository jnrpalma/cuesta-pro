import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoNotificationService,
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
  
  selectedAnimal: any = null;
  selectedAnimalFirestoreId: string | null = null; // Armazena apenas o ID para o ngModel do po-select

  vaccinationDate: string = '';
  vaccineName: string = '';
  observation: string = '';
  dose: string = '';

  doseOptions: PoSelectOption[] = [
    { label: '1ª', value: '1' },
    { label: '2ª', value: '2' },
    { label: '3ª', value: '3' },
    { label: 'Dose Única', value: 'dose_unica' }
  ];

  constructor(
    private vaccinationService: VaccinationService,
    private animalService: AnimalService,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.loadAnimals();
  }

  loadAnimals() {
    this.animalService.getAllAnimals().subscribe(animals => {
      console.log('Animais carregados do Firestore:', animals);
  
      this.animalsMap = {};
      this.animals = animals.map(a => {
        const fid = a.firestoreId!;
        this.animalsMap[fid] = a;
        
        return {
          label: a.id,     
          value: fid       
        } as PoSelectOption;
      });
  
      console.log('Opções do select (this.animals):', this.animals);
      console.log('Mapa de animais (this.animalsMap):', this.animalsMap);
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
      // Atualiza o animal marcando como vacinado
      const updatedAnimal = { ...this.selectedAnimal, isVaccinated: true };
      this.animalService.updateAnimal(updatedAnimal).then(() => {
        console.log('Flag de vacinação atualizada no animal.');
      });
    })
    .catch((error: any) => {
      this.poNotification.error('Erro ao registrar a vacinação.');
      console.error('Erro ao registrar a vacinação:', error);
    });
  }
}
