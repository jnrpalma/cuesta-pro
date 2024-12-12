import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoButtonModule, PoNotificationService, PoTableColumn, PoTableModule, PoModalModule, PoFieldModule } from '@po-ui/ng-components';
import { VaccinationService } from '../../services/vaccination/vaccination.service'; // Serviço que lidará com os dados de vacinação
import { AnimalService } from '../../services/animal/animal.service'; // Importando o serviço AnimalService

@Component({
  selector: 'app-vaccination',
  standalone: true,
  imports: [CommonModule, FormsModule, PoTableModule, PoButtonModule, PoModalModule, PoFieldModule],
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {
  animals: any[] = []; // Lista de animais a serem carregados do banco de dados
  vaccinations: any[] = []; // Lista de vacinações aplicadas
  selectedAnimal: any = null; // Animal selecionado para aplicação de vacinação
  vaccinationDate: string = ''; // Data da vacinação
  vaccineName: string = ''; // Nome da vacina
  observation: string = ''; // Observações sobre a vacinação

  columns: PoTableColumn[] = [
    { property: 'animalName', label: 'Animal' },
    { property: 'vaccineName', label: 'Vacina' },
    { property: 'date', label: 'Data de Aplicacao' },
    { property: 'observation', label: 'Observações' },
  ];

  constructor(private vaccinationService: VaccinationService, private animalService: AnimalService, private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.loadAnimals();
    this.loadVaccinations();
  }

  loadAnimals() {
    // Carrega a lista de animais a partir do serviço de dados
    this.animalService.getAllAnimals().subscribe(animals => {
      this.animals = animals.map(a => ({ value: a, label: a.id })); // Ajusta os animais para serem usados no PoSelect
    });
  }

  loadVaccinations() {
    // Carrega a lista de vacinações aplicadas
    this.vaccinationService.getVaccinations().subscribe(vaccinations => {
      this.vaccinations = vaccinations;
    });
  }

  onAnimalChange(animal: any) {
    this.selectedAnimal = animal;
  }

  applyVaccination() {
    if (!this.selectedAnimal?.value || !this.vaccineName || !this.vaccinationDate ) {
      this.poNotification.warning('Por favor, preencha todos os campos para registrar a vacinação.');
      return;
    }
  
    const vaccination = {
      animalId: this.selectedAnimal.value.firestoreId,
      animalName: this.selectedAnimal.label,
      vaccineName: this.vaccineName,
      date: this.vaccinationDate,
      observation: this.observation
    };
  
    this.vaccinationService.applyVaccination(vaccination).then(() => {
      this.poNotification.success('Vacinação registrada com sucesso!');
      this.loadVaccinations(); // Atualiza a tabela de vacinações
    }).catch(error => {
      this.poNotification.error('Erro ao registrar a vacinação.');
      console.error(error);
    });
  }
  
}



