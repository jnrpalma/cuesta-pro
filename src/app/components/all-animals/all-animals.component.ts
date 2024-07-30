import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTableModule, PoButtonModule, PoNotificationService } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { Animal } from '../register-animal/interface/animal.interface';

@Component({
  selector: 'app-list-animals',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoButtonModule],
  templateUrl: './all-animals.component.html',
  styleUrls: ['./all-animals.component.css']
})
export class AllAnimalsComponent implements OnInit {
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
    { property: 'quantity', label: 'Quantidade de Registros', type: 'number', visible: false },
    {
      property: 'actions', label: 'Ações', type: 'icon', icons: [
        { action: this.deleteAnimal.bind(this), icon: 'po-icon-delete', tooltip: 'Excluir', value: 'delete' }
      ]
    }
  ];

  animals: Animal[] = [];
  showTable = false;
  actions = [
    {
      action: this.deleteAnimal.bind(this),
      icon: 'po-icon-delete',
      label: 'Excluir',
      type: 'danger'
    }
  ];

  constructor(private animalService: AnimalService, private poNotification: PoNotificationService) {}

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
  
  

  deleteAnimal(animal: Animal) {
    console.log('Iniciando exclusão do animal com ID:', animal.id);
    this.animalService.deleteAnimal(animal.id).then(() => {
      console.log('Animal excluído com sucesso:', animal.id);
      this.poNotification.success('Animal excluído com sucesso!');
      setTimeout(() => {
        this.loadAnimals(); // Recarregar a lista de animais após um pequeno delay
      }, 500); // 0.5 segundo de delay
    }).catch(error => {
      console.error('Erro ao excluir o animal:', error);
      this.poNotification.error('Erro ao excluir o animal: ' + error.message);
    });
  }
  
  

  get tableButtonLabel() {
    return this.showTable ? 'Esconder Todos os Animais' : 'Ver Todos os Animais';
  }
}
