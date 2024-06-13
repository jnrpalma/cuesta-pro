import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTableModule, PoButtonModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { Animal } from '../register-animal/interface/animal.interface';

@Component({
  selector: 'app-list-animals',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoButtonModule],
  templateUrl: './list-animals.component.html',
  styleUrls: ['./list-animals.component.css']
})
export class ListAnimalsComponent implements OnInit {
  columns = [
    { property: 'id', label: 'ID Brinco', type: 'string' },
    { property: 'genero', label: 'Gênero', type: 'string' },
    { property: 'categoria', label: 'Categoria', type: 'string' },
    { property: 'raca', label: 'Raça', type: 'string' },
    { property: 'data', label: 'Data', type: 'date' },
    { property: 'registradoPor', label: 'Registrado por', type: 'string' }
  ];

  animals: Animal[] = [];
  showTable = false;

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    // Optionally, load animals initially if required
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
