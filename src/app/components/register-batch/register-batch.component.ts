import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoDynamicModule, PoDynamicFormField, PoButtonModule, PoNotificationService, PoLoadingModule, PoFieldModule, PoTableModule, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { BatchService } from '../../services/batch/batch.service';
import { ChangeDetectorRef } from '@angular/core';
import { Animal } from '../register-animal/interface/animal.interface';
import { Batch } from './interface/batch.interface';


@Component({
  selector: 'app-register-batch',
  standalone: true,
  imports: [CommonModule, FormsModule, PoButtonModule, PoDynamicModule, PoLoadingModule, PoFieldModule, PoTableModule],
  templateUrl: './register-batch.component.html',
  styleUrls: ['./register-batch.component.css']
})
export class RegisterBatchComponent implements OnInit {
  showBatchForm: boolean = false;
  batchFormButtonLabel: string = 'Formulário de Cadastro de Lote';

  batchAnimal: any = {
    lote: '',
    categoria: ''
  };
  
  isLoading = false;

  batchFields: Array<PoDynamicFormField> = [
    { property: 'lote', label: 'Nome do Lote', gridColumns: 6, required: true },
    { 
      property: 'categoria', 
      label: 'Categoria do Lote', 
      type: 'select', 
      options: [], 
      gridColumns: 6, 
      required: true 
    }
  ];

  newCategory: string = '';
  animals: Animal[] = [];
  selectedAnimals: Animal[] = [];

  columns: PoTableColumn[] = [
    { property: 'id', label: 'ID Brinco', type: 'string' },
    { property: 'genero', label: 'Gênero', type: 'string' },
    { property: 'categoria', label: 'Categoria', type: 'string' },
    { property: 'raca', label: 'Raça', type: 'string' },
    { property: 'data', label: 'Data de Registro', type: 'date',visible: false },
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

  constructor(
    private animalService: AnimalService,
    private batchService: BatchService,
    private poNotification: PoNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAnimals();
  }

  loadAnimals() {
    this.isLoading = true;
    this.animalService.getAnimals().subscribe((data: Animal[]) => {
      this.animals = data;
      this.isLoading = false;
    }, error => {
      this.poNotification.error('Erro ao carregar animais.');
      this.isLoading = false;
    });
  }

  toggleBatchForm() {
    this.showBatchForm = !this.showBatchForm;
    this.batchFormButtonLabel = this.showBatchForm ? 'Ocultar Formulário de Cadastro de Lote' : 'Formulário de Cadastro de Lote';
  }

  cadastrarLote(animalTable: PoTableComponent) {
    this.selectedAnimals = animalTable.getSelectedRows();
    console.log('Animais selecionados:', this.selectedAnimals);

    const batchData: Batch = {
      id: '', 
      nomeLote: this.batchAnimal.lote,
      categoria: this.batchAnimal.categoria,
      animais: this.selectedAnimals 
    };

    console.log('Dados do lote a serem cadastrados:', batchData);

    this.batchService.addBatch(batchData).then(() => {
      this.poNotification.success('Cadastro de lote realizado com sucesso!');
      this.restaurarBatchForm();
    }).catch(error => {
      console.error('Erro ao cadastrar lote:', error);
      this.poNotification.error('Erro ao cadastrar lote.');
    });
  }

  restaurarBatchForm() {
    this.batchAnimal = {
      lote: '',
      categoria: ''
    };
    this.selectedAnimals = [];
  }

  adicionarCategoria() {
    if (this.newCategory.trim()) {
      const categoriaField = this.batchFields.find(field => field.property === 'categoria');
      if (categoriaField && categoriaField.options) {
        categoriaField.options.push({ label: this.newCategory, value: this.newCategory.toLowerCase().replace(/\s+/g, '') });
        this.newCategory = '';
        this.poNotification.success('Categoria adicionada com sucesso!');
       
        this.batchFields = [...this.batchFields];
        this.cdr.detectChanges();
      }
    } else {
      this.poNotification.error('Por favor, insira um nome de categoria válido.');
    }
  }

  onAnimalSelectionChange(event: any, animalTable: PoTableComponent) {
    this.selectedAnimals = animalTable.getSelectedRows();
    console.log('Seleção de animais atualizada:', this.selectedAnimals);
  }
}
