import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTableModule, PoButtonModule, PoNotificationService, PoModalModule, PoModalComponent } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-animals',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoButtonModule, PoModalModule],
  templateUrl: './all-animals.component.html',
  styleUrls: ['./all-animals.component.css']
})
export class AllAnimalsComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  columns = [
    { property: 'id', label: 'ID Brinco', type: 'string' },
    { property: 'genero', label: 'Gênero', type: 'string' },
    { property: 'categoria', label: 'Categoria', type: 'string' },
    { property: 'raca', label: 'Raça', type: 'string' },
    { property: 'data', label: 'Data de Registro', type: 'date' },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date' },
    { property: 'peso', label: 'Peso', type: 'number' },
    { property: 'denticao', label: 'Dentição', type: 'string' },
    { property: 'paiAnimal', label: 'Pai (Animal Próprio/Terceiro)', type: 'string', visible: false },
    { property: 'nomePai', label: 'Nome do Pai', type: 'string', visible: false },
    { property: 'maeAnimal', label: 'Mãe (Animal Próprio/Terceiro)', type: 'string', visible: false },
    { property: 'nomeMae', label: 'Nome da Mãe', type: 'string', visible: false },
    { property: 'registradoPor', label: 'Registrado por', type: 'string' },
    { property: 'quantity', label: 'Quantidade de Registros', type: 'number', visible: false }
  ];

  animals: Animal[] = [];
  showTable = false;
  animalToDelete: Animal | null = null;

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

  constructor(private animalService: AnimalService, private poNotification: PoNotificationService, private router: Router) {}

  ngOnInit() {}

  toggleTable() {
    if (!this.showTable) {
      this.loadAnimals();
    }
    this.showTable = !this.showTable;
  }

  loadAnimals() {
    this.animalService.getAnimals().subscribe((data: Animal[]) => {
      this.animals = data;
      console.log('Lista de animais carregada:', this.animals);
    });
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
          this.loadAnimals(); // Recarregar a lista de animais após um pequeno delay
          this.poModal.close();
          this.animalToDelete = null; // Resetar animalToDelete
        }, 500); // 0.5 segundo de delay
      }).catch(error => {
        console.error('Erro ao excluir o animal:', error);
        this.poNotification.error('Erro ao excluir o animal: ' + error.message);
        this.poModal.close();
        this.animalToDelete = null; // Resetar animalToDelete
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
}
