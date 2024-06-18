import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTableModule, PoButtonModule } from '@po-ui/ng-components';
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
    { property: 'quantity', label: 'Quantidade de Registros', type: 'number' , visible: false}
  ];

  animals: Animal[] = [];
  showTable = false;

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
  }

  toggleTable() {
    if (!this.showTable) {
      this.loadAnimals();
    }
    this.showTable = !this.showTable;
  }

  loadAnimals() {
    this.animalService.getAnimals().subscribe((data: Animal[]) => {
      this.animals = data;
    });
  }

  get tableButtonLabel() {
    return this.showTable ? 'Esconder Todos os Animais' : 'Ver Todos os Animais';
  }
}
