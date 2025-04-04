import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  PoTableModule, 
  PoButtonModule, 
  PoNotificationService, 
  PoModalModule, 
  PoModalComponent, 
  PoTableColumn, 
  PoInfoModule 
} from '@po-ui/ng-components';
import { Animal } from '../register-animal/interface/animal.interface';
import { Router } from '@angular/router';
import { AnimalManagementService } from '../../services/animal/animal-management.service';

@Component({
  selector: 'app-deceased-animals',
  standalone: true,
  imports: [CommonModule, PoTableModule, PoButtonModule, PoModalModule, PoInfoModule],
  templateUrl: './deceased-animals.component.html',
  styleUrls: ['./deceased-animals.component.css']
})
export class DeceasedAnimalsComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  columns: PoTableColumn[] = [
    { property: 'id', label: 'ID Brinco', type: 'string' },
    { property: 'categoria', label: 'Categoria', type: 'string' },
    { property: 'data', label: 'Data de Registro', type: 'date' },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date' },
    { property: 'denticao', label: 'Dentição', type: 'string' },
    { property: 'genero', label: 'Gênero', type: 'string' },
    { property: 'raca', label: 'Raça', type: 'string' },
    { property: 'peso', label: 'Peso', type: 'number' },
    { property: 'maeAnimal', label: 'Mãe (Animal Próprio/Terceiro)', type: 'string' },
    { property: 'nomeMae', label: 'Nome da Mãe', type: 'string' },
    { property: 'nomePai', label: 'Nome do Pai', type: 'string' },
    { property: 'registradoPor', label: 'Registrado por', type: 'string' },
  ];

  totalDeceasedAnimals: number = 0;
  deceasedAnimals: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private animalService: AnimalManagementService, 
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.animalService.getDeceasedAnimalsCount().subscribe((count) => {
      this.totalDeceasedAnimals = count;
      console.log('Total de animais mortos carregado:', this.totalDeceasedAnimals);
    });
    this.loadDeceasedAnimals();
  }

  loadDeceasedAnimals(): void {
    this.animalService.getDeceasedAnimals().subscribe(
      (deceasedAnimals) => {
        console.log('Mortes carregadas:', deceasedAnimals);
        this.deceasedAnimals = deceasedAnimals;
      },
      (error) => {
        console.error('Erro ao carregar animais mortos:', error);
      }
    );
  }
}
