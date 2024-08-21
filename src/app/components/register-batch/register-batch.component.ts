import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PoDynamicModule, PoButtonModule, PoNotificationService, PoLoadingModule, PoFieldModule, PoTableModule, PoTableColumn, PoTableComponent, PoComboOption } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { BatchService } from '../../services/batch/batch.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { Batch } from './interface/batch.interface';
import { CategoryService } from '../../services/category/category.service';

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
  categoryOptions: Array<PoComboOption> = []; // Opções do combo de categorias

  newCategory: string = '';
  animals: Animal[] = [];
  selectedAnimals: Animal[] = [];

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
    { property: 'quantity', label: 'Quantidade de Registros', type: 'number', visible: false }
  ];

  constructor(
    private animalService: AnimalService,
    private batchService: BatchService,
    private poNotification: PoNotificationService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAnimals();
    this.loadCategories(); // Carregar categorias ao iniciar
  }

  loadAnimals() {
    this.isLoading = true;
    this.animalService.getAllAnimals().subscribe((data: Animal[]) => {
      this.animals = data;
      this.isLoading = false;
    }, error => {
      this.poNotification.error('Erro ao carregar animais.');
      this.isLoading = false;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categoryOptions = categories.map(category => ({
        label: category.label,
        value: category.value
      }));
    });
  }

  toggleBatchForm() {
    this.showBatchForm = !this.showBatchForm;
    this.batchFormButtonLabel = this.showBatchForm ? 'Ocultar Formulário de Cadastro de Lote' : 'Formulário de Cadastro de Lote';
  }

  cadastrarLote(animalTable: PoTableComponent) {
    this.selectedAnimals = animalTable.getSelectedRows();
    
    const batchData: Batch = {
      id: '', 
      nomeLote: this.batchAnimal.lote,
      categoria: this.batchAnimal.categoria,
      animais: this.selectedAnimals 
    };

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
      const newOption = { label: this.newCategory, value: this.newCategory.toLowerCase().replace(/\s+/g, '') };
      
      // Verificar se a categoria já existe
      this.categoryService.categoryExists(newOption.value).subscribe(exists => {
        if (exists) {
          this.poNotification.error('Categoria já existe.');
        } else {
          this.categoryService.addCategory(newOption).then(() => {
            this.categoryOptions.push(newOption); // Adicionar nova categoria ao combo
            this.batchAnimal.categoria = newOption.value; // Selecionar a nova categoria automaticamente
            this.newCategory = '';
            this.poNotification.success('Categoria adicionada com sucesso!');
            
            // Atualizar o combo com as novas opções
            this.categoryOptions = [...this.categoryOptions];
            this.cdr.detectChanges();
          }).catch(error => {
            console.error('Erro ao adicionar categoria:', error);
            this.poNotification.error('Erro ao adicionar categoria.');
          });
        }
      });
    } else {
      this.poNotification.error('Por favor, insira um nome de categoria válido.');
    }
  }

  onCategoryChange(selectedCategory: string) {
    this.batchAnimal.categoria = selectedCategory;
  }

  onAnimalSelectionChange(event: any, animalTable: PoTableComponent) {
    this.selectedAnimals = animalTable.getSelectedRows();
  }
}
