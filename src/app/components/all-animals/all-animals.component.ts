import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTableModule, PoButtonModule, PoNotificationService, PoModalModule, PoModalComponent, PoTableColumn } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { Router } from '@angular/router';
import { VaccinationService } from '../../services/vaccination/vaccination.service';

@Component({
  selector: 'app-list-animals',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoButtonModule, PoModalModule],
  templateUrl: './all-animals.component.html',
  styleUrls: ['./all-animals.component.css']
})
export class AllAnimalsComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  columns: PoTableColumn[] = [
    { property: 'id', label: 'ID Brinco', type: 'string' },
    { property: 'genero', label: 'Gênero', type: 'string' },
    { property: 'categoria', label: 'Categoria', type: 'string' },
    { property: 'raca', label: 'Raça', type: 'string' },
    { property: 'data', label: 'Data de Registro', type: 'date', visible: false },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date' },
    { property: 'peso', label: 'Peso', type: 'number' },
    { property: 'denticao', label: 'Dentição', type: 'string' },
    { property: 'paiAnimal', label: 'Pai (Animal Próprio/Terceiro)', type: 'string', visible: false },
    { property: 'nomePai', label: 'Nome do Pai', type: 'string', visible: false },
    { property: 'maeAnimal', label: 'Mãe (Animal Próprio/Terceiro)', type: 'string', visible: false },
    { property: 'nomeMae', label: 'Nome da Mãe', type: 'string', visible: false },
    { property: 'registradoPor', label: 'Registrado por', type: 'string' },
    { property: 'quantity', label: 'Quantidade de Registros', type: 'number', visible: false },
    {
      property: 'isVaccinated',
      label: 'Vacinado',
      type: 'boolean',
      boolean: {
        trueLabel: 'Sim',
        falseLabel: 'Não'
      }
    }
  ];

  // Colunas da tabela de vacinações
  vacColumns: PoTableColumn[] = [
    { property: 'animalName', label: 'Animal' },
    { property: 'vaccineName', label: 'Vacina' },
    { property: 'dose', label: 'Dose' },
    { property: 'date', label: 'Data de Aplicação' },
    { property: 'observation', label: 'Observações' },
  ];

  animals: Animal[] = [];
  vaccinations: any[] = [];
  
  showTable = false;
  showVaccinationsTable = false;
  
  animalToDelete: Animal | null = null;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  actions = [
    {
      action: this.updateAnimal.bind(this),
      icon: 'po-icon-edit',
      label: 'Atualizar',
      type: 'default'
    },
    {
      action: this.confirmDelete.bind(this),
      icon: 'po-icon-delete',
      label: 'Excluir',
      type: 'danger'
    }
  ];

  constructor(
    private animalService: AnimalService, 
    private poNotification: PoNotificationService, 
    private router: Router,
    private vaccinationService: VaccinationService
  ) {}

  ngOnInit() {
    // Opcional: carregar dados iniciais se desejado.
  }

  loadAnimals() {
    this.animalService.getAnimals(this.currentPage, this.pageSize).subscribe((data: Animal[]) => {
      this.animals = data;
      console.log('Lista de animais carregada:', this.animals);
    });
  }

  loadMoreAnimals() {
    if (this.animals.length >= this.pageSize * this.currentPage) {
      this.currentPage++;
      this.animalService.getAnimals(this.currentPage, this.pageSize).subscribe((data: Animal[]) => {
        this.animals = [...this.animals, ...data];
        console.log('Mais animais carregados:', data);
      });
    }
  }

  loadVaccinations() {
    this.vaccinationService.getVaccinations().subscribe(vaccinations => {
      this.vaccinations = vaccinations;
      console.log('Vacinações carregadas:', this.vaccinations);
    });
  }

  toggleAnimalsTable() {
    // Ao abrir a tabela de animais, fecha a de vacinações
    if (!this.showTable) {
      this.showVaccinationsTable = false;
      this.animalService.resetPagination(); 
      this.loadAnimals();
    }
    this.showTable = !this.showTable;
  }

  toggleVaccinationsTable() {
    // Ao abrir a tabela de vacinações, fecha a de animais
    if (!this.showVaccinationsTable) {
      this.showTable = false;
      this.loadVaccinations();
    }
    this.showVaccinationsTable = !this.showVaccinationsTable;
  }

  confirmDelete(animal: Animal) {
    this.animalToDelete = animal;
    this.poModal.open();
  }

  deleteAnimal() {
    const firestoreId = this.animalToDelete?.firestoreId;
    if (firestoreId) {
      console.log('Iniciando exclusão do animal com Firestore ID:', firestoreId);
      this.animalService.deleteAnimal(firestoreId).then(() => {
        console.log('Animal excluído com sucesso:', firestoreId);
        this.poNotification.success('Animal excluído com sucesso!');
        setTimeout(() => {
          this.loadAnimals(); 
          this.poModal.close();
          this.animalToDelete = null;
        }, 500);
      }).catch(error => {
        console.error('Erro ao excluir o animal:', error);
        this.poNotification.error('Erro ao excluir o animal: ' + error.message);
        this.poModal.close();
        this.animalToDelete = null;
      });
    } else {
      console.error('Erro ao excluir o animal: Firestore ID não encontrado.');
      this.poNotification.error('Erro ao excluir o animal: Firestore ID não encontrado.');
      this.poModal.close();
    }
  }

  updateAnimal(animal: Animal) {
    this.router.navigate(['/dashboard/update-animal', animal.firestoreId]);
  }

  get tableButtonLabel() {
    return this.showTable ? 'Esconder Todos os Animais' : 'Ver Todos os Animais';
  }

  get vaccinationsButtonLabel() {
    return this.showVaccinationsTable ? 'Esconder Animais Vacinados' : 'Ver Todos Animais Vacinados';
  }
}
