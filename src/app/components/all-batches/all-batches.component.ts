import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListViewModule, PoInfoModule, PoLoadingModule, PoNotificationService, PoModalModule, PoModalComponent, PoButtonModule, PoTableModule, PoTableColumn } from '@po-ui/ng-components';
import { BatchService } from '../../services/batch/batch.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { CategoryService } from '../../services/category/category.service'; // Importação do CategoryService

@Component({
  selector: 'app-all-batches',
  standalone: true,
  imports: [CommonModule, PoListViewModule, PoInfoModule, PoLoadingModule, PoModalModule, PoButtonModule, PoTableModule],
  templateUrl: './all-batches.component.html',
  styleUrls: ['./all-batches.component.css']
})
export class AllBatchesComponent implements OnInit {
  @ViewChild('poModal', { static: true }) poModal!: PoModalComponent;
  @ViewChild('animalModal', { static: true }) animalModal!: PoModalComponent;

  batches: any[] = [];
  isLoading: boolean = false;
  batchToDelete: any;
  selectedBatchAnimals: Animal[] = [];
  animalsVisibleBatchId: string | null = null;
  showAnimals: boolean = false; // Adicionando a propriedade showAnimals

  actions = [
    {
      label: 'Ver Animais',
      icon: 'po-icon-list',
      action: this.toggleAnimalsView.bind(this)
    },
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.confirmDelete.bind(this)
    }
  ];

  columns: PoTableColumn[] = [
    { property: 'id', label: 'ID Brinco', type: 'string' },
    { property: 'genero', label: 'Gênero', type: 'string' },
    { property: 'categoria', label: 'Categoria', type: 'string' },
    { property: 'raca', label: 'Raça', type: 'string' },
    { property: 'data', label: 'Data de Registro', type: 'date' },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date' },
    { property: 'peso', label: 'Peso', type: 'number' },
    { property: 'denticao', label: 'Dentição', type: 'string' }
  ];

  constructor(
    private batchService: BatchService, 
    private poNotification: PoNotificationService, 
    private categoryService: CategoryService // Injeção do CategoryService
  ) {}

  ngOnInit() {
    this.loadBatches();
  }

  loadBatches() {
    this.isLoading = true;
    this.batchService.getBatches().subscribe(batches => {
      this.batches = batches.map(batch => {
        const rawDate = batch.dataCadastro;
  
        let processedDate: Date | null = null;
  
        // Verifica se rawDate é um objeto do Firestore Timestamp
        if (rawDate && typeof rawDate === 'object' && 'seconds' in rawDate && 'nanoseconds' in rawDate) {
          const timestamp = rawDate as { seconds: number, nanoseconds: number }; // Type assertion
          processedDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        } else if (rawDate instanceof Date) {
          processedDate = rawDate;
        }
  
        console.log('Batch ID:', batch.id);
        console.log('Raw dataCadastro:', rawDate);
        console.log('Processed dataCadastro:', processedDate);
        console.log('Is valid date:', processedDate instanceof Date && !isNaN(processedDate.getTime()));
  
        return {
          ...batch,
          dataCadastro: processedDate
        };
      });
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.error('Erro ao carregar lotes cadastrados', error);
    });
  }
  
  
  
  
  

  confirmDelete(batch: any) {
    this.batchToDelete = batch;
    this.poModal.open();
  }

  deleteBatch() {
    if (this.batchToDelete) {
      const categoriaExcluida = this.batchToDelete.categoria;
  
      this.batchService.deleteBatch(this.batchToDelete.firestoreId).then(() => {
        this.poNotification.success('Lote excluído com sucesso!');
        this.loadBatches(); // Recarrega a lista de lotes
        this.selectedBatchAnimals = [];
        this.showAnimals = false; // Certifique-se de que a tabela de animais esteja oculta
        this.animalsVisibleBatchId = null;
  
        // Remover a categoria do combo de seleção usando o CategoryService
        this.categoryService.removeCategory(categoriaExcluida).then(() => {
          this.poNotification.success('Categoria removida do combo.');
        }).catch(error => {
          console.error('Erro ao remover a categoria:', error);
          this.poNotification.error('Erro ao remover a categoria: ' + error.message);
        });
  
        this.poModal.close();
      }).catch(error => {
        console.error('Erro ao excluir o lote:', error);
        this.poNotification.error('Erro ao excluir o lote: ' + error.message);
        this.poModal.close();
      });
    }
  }

  formatDate(date: Date | null | undefined): string {
    console.log('Formatting date:', date);
    
    if (!date) {
      return 'Não informado';
    }
  
    const validDate = new Date(date);
    
    // Verifica se a data é válida
    if (isNaN(validDate.getTime())) {
      console.log('Invalid date:', date);
      return 'Data inválida';
    }
  
    return validDate.toLocaleDateString();
  }
  
  
  
  toggleAnimalsView(batch: any) {
    if (this.animalsVisibleBatchId === batch.firestoreId) {
      this.animalsVisibleBatchId = null;
      this.selectedBatchAnimals = [];
      this.showAnimals = false;
      this.animalModal.close();
    } else {
      this.selectedBatchAnimals = batch.animais || [];
      this.animalsVisibleBatchId = batch.firestoreId;
      this.showAnimals = true;
      this.animalModal.open();
    }
  }
}
