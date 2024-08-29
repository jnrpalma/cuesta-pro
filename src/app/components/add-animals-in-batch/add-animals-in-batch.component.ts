import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTableModule, PoButtonModule, PoLoadingModule, PoModalModule, PoModalComponent } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { PoTableColumn } from '@po-ui/ng-components';
import { Animal } from '../register-animal/interface/animal.interface';

@Component({
  selector: 'app-add-animals-in-batch',
  standalone: true,
  imports: [
    CommonModule,
    PoTableModule,
    PoButtonModule,
    PoLoadingModule,
    PoModalModule,
  ],
  templateUrl: './add-animals-in-batch.component.html',
  styleUrls: ['./add-animals-in-batch.component.css'],
})
export class AddAnimalsInBatchComponent implements OnInit {
  @Input() batchId!: string;
  @Output() animalsAdded = new EventEmitter<Animal[]>();
  @ViewChild('addAnimalsModal') addAnimalsModal!: PoModalComponent;

  animals: Animal[] = [];
  selectedAnimals: Animal[] = [];
  isLoading = false;

  columns: PoTableColumn[] = [
    { property: 'id', label: 'ID Brinco', type: 'string' },
    { property: 'genero', label: 'Gênero', type: 'string' },
    { property: 'categoria', label: 'Categoria', type: 'string' },
    { property: 'raca', label: 'Raça', type: 'string' },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date' },
    { property: 'peso', label: 'Peso', type: 'number' }
  ];

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    this.loadAnimals();
  }

  loadAnimals() {
    this.isLoading = true;
    this.animalService.getAllAnimals().subscribe(
      (data: Animal[]) => {
        this.animals = data;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        console.error('Erro ao carregar animais.');
      }
    );
  }

  onAnimalSelection(event: any) {
    this.selectedAnimals = event;
  }

  confirmAnimalsSelection() {
    this.animalsAdded.emit(this.selectedAnimals);
  }

  cancel() {
    this.addAnimalsModal.close();
  }
}
