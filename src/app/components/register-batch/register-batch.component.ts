import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PoDynamicModule,
  PoButtonModule,
  PoNotificationService,
  PoLoadingModule,
  PoFieldModule,
  PoTableModule,
  PoTableColumn,
  PoTableComponent,
  PoComboOption,
  PoPageModule,
  PoModalModule,
  PoModalComponent,
} from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { BatchService } from '../../services/batch/batch.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { Batch } from './interface/batch.interface';
import { CategoryService } from '../../services/category/category.service';
import { switchMap, take, throwError } from 'rxjs';
import { AddAnimalsInBatchComponent } from '../add-animals-in-batch/add-animals-in-batch.component';

@Component({
    selector: 'app-register-batch',
    imports: [
        CommonModule,
        FormsModule,
        PoButtonModule,
        PoPageModule,
        PoDynamicModule,
        PoLoadingModule,
        PoFieldModule,
        PoTableModule,
        PoModalModule,
        AddAnimalsInBatchComponent,
    ],
    templateUrl: './register-batch.component.html',
    styleUrls: ['./register-batch.component.css']
})
export class RegisterBatchComponent implements OnInit {
  @ViewChild('confirmCategoryModal') confirmCategoryModal!: PoModalComponent;
  @ViewChild('addAnimalsModal') addAnimalsModal!: PoModalComponent;

  loteAtual: string = '';
  formularioValido: boolean = false;

  showBatchForm: boolean = false;
  batchFormButtonLabel: string = 'Formulário de Cadastro de Lote';

  batchAnimal: any = {
    lote: '',
    categoria: '',
  };

  isLoading = false;
  categoryOptions: Array<PoComboOption> = [];
  newCategory: string = '';
  animals: Animal[] = [];
  selectedAnimals: Animal[] = [];
  pendingCategorySelection: string = '';

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
    this.loadCategories();
  }

  loadAnimals() {
    this.isLoading = true;
    this.animalService.getAllAnimals().subscribe(
      (data: Animal[]) => {
        this.animals = data;
        this.isLoading = false;
      },
      () => {
        this.poNotification.error('Erro ao carregar animais.');
        this.isLoading = false;
      }
    );
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categoryOptions = categories.map((category) => ({
        label: category.label,
        value: category.value,
      }));
    });
  }

  toggleBatchForm() {
    this.showBatchForm = !this.showBatchForm;
    this.batchFormButtonLabel = this.showBatchForm
      ? 'Ocultar Formulário de Cadastro de Lote'
      : 'Formulário de Cadastro de Lote';
  }

  onCategoryChange(selectedCategory: string) {
    this.batchAnimal.categoria = selectedCategory;
    this.verificarFormularioValido();

    this.batchService.batchExists(selectedCategory).pipe(
      take(1),
      switchMap(exists => {
        if (exists) {
          return this.batchService.getLoteByCategoria(selectedCategory);
        } else {
          return throwError(() => new Error('Categoria não existe'));
        }
      })
    ).subscribe({
      next: lote => {
        this.loteAtual = lote.nomeLote;
        this.confirmCategoryModal.open();
      },
      error: () => {
        this.poNotification.error('Erro ao carregar o lote.');
      }
    });
  }

  verificarFormularioValido() {
    this.formularioValido = this.batchAnimal.lote.trim() !== '' && this.batchAnimal.categoria.trim() !== '';
  }

  confirmCategorySelection() {
    this.confirmCategoryModal.close();
  }

  cancelCategorySelection() {
    this.confirmCategoryModal.close();
  }

  cadastrarLote(animalTable: PoTableComponent) {
    this.selectedAnimals = animalTable.getSelectedRows();

    if (!this.validarFormulario()) {
      return;
    }

    this.verificarCategoriaExistenteEProcessarLote();
  }

  private validarFormulario(): boolean {
    if (!this.batchAnimal.categoria) {
      this.poNotification.error(
        'Selecione uma categoria antes de cadastrar o lote.'
      );
      return false;
    }

    if (this.selectedAnimals.length === 0) {
      this.poNotification.error(
        'Selecione pelo menos um animal para cadastrar o lote.'
      );
      return false;
    }

    return true;
  }

  private verificarCategoriaExistenteEProcessarLote() {
    this.batchService
      .batchExists(this.batchAnimal.categoria)
      .pipe(take(1))
      .subscribe({
        next: (exists) => {
          if (exists) {
            this.poNotification.error(
              'Já existe um lote com esta categoria. Não é possível adicionar mais animais a este lote.'
            );
          } else {
            this.processarCadastroDeLote();
          }
        },
        error: () => {
          this.poNotification.error('Erro ao verificar existência de lote.');
        },
      });
  }

  private processarCadastroDeLote() {
    const batchData: Batch = {
      id: '',
      nomeLote: this.batchAnimal.lote,
      categoria: this.batchAnimal.categoria,
      animais: this.selectedAnimals,
      dataCadastro: new Date(), 
      firestoreId: ''
    };
  
    this.batchService.addBatch(batchData)
      .then(() => {
        this.poNotification.success('Cadastro de lote realizado com sucesso!');
        this.restaurarBatchForm();
      })
      .catch(() => {
        this.poNotification.error('Erro ao cadastrar lote.');
      });
  }

  restaurarBatchForm() {
    this.batchAnimal = {
      lote: '',
      categoria: '',
    };
    this.selectedAnimals = [];
    this.formularioValido = false;
  }

  adicionarCategoria() {
    if (this.newCategory.trim()) {
      const newOption = {
        label: this.newCategory,
        value: this.newCategory.toLowerCase().replace(/\s+/g, ''),
      };

      this.categoryService
        .categoryExists(newOption.value)
        .pipe(
          take(1),
          switchMap((exists) => {
            if (exists) {
              this.poNotification.error('Categoria já existe.');
              return throwError(() => new Error('Categoria já existe'));
            } else {
              return this.categoryService.addCategory(newOption).then(() => {
                return newOption;
              });
            }
          })
        )
        .subscribe({
          next: (newCategory) => {
            this.categoryOptions.push(newCategory);
            this.batchAnimal.categoria = newCategory.value;
            this.newCategory = '';
            this.poNotification.success('Categoria adicionada com sucesso! Agora selecione quais animais.');
            this.categoryOptions = [...this.categoryOptions];
            this.cdr.detectChanges();
            this.verificarFormularioValido();
          },
          error: (err) => {
            console.error('Erro durante a adição da categoria:', err.message);
          },
        });
    } else {
      this.poNotification.error(
        'Por favor, insira um nome de categoria válido.'
      );
    }
  }

  onAnimalSelectionChange(event: any, animalTable: PoTableComponent) {
    this.selectedAnimals = animalTable.getSelectedRows();
  }

  openAddAnimalsModal() {
    this.addAnimalsModal.open();
    this.confirmCategoryModal.close();
  }

  handleAnimalsAdded(animals: Animal[]) {
    
  }
}
