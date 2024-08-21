import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListViewModule, PoInfoModule, PoLoadingModule, PoNotificationService, PoModalModule, PoModalComponent, PoButtonModule, PoTableModule, PoTableColumn } from '@po-ui/ng-components';
import { BatchService } from '../../services/batch/batch.service';
import { Animal } from '../register-animal/interface/animal.interface';

@Component({
  selector: 'app-all-batches',
  standalone: true,
  imports: [CommonModule, PoListViewModule, PoInfoModule, PoLoadingModule, PoModalModule, PoButtonModule, PoTableModule],
  templateUrl: './all-batches.component.html',
  styleUrls: ['./all-batches.component.css']
})
export class AllBatchesComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  batches: any[] = [];
  isLoading: boolean = false;
  batchToDelete: any;
  selectedBatchAnimals: Animal[] = []; // Lista de animais do lote selecionado
  showAnimals: boolean = false; // Flag para mostrar ou ocultar animais
  animalsVisibleBatchId: string | null = null; // ID do lote atual com animais visíveis

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

  constructor(private batchService: BatchService, private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.loadBatches();
  }

  loadBatches() {
    this.isLoading = true;
    this.batchService.getBatches().subscribe(batches => {
      this.batches = batches;
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
      this.batchService.deleteBatch(this.batchToDelete.firestoreId).then(() => {
        this.poNotification.success('Lote excluído com sucesso!');
        this.loadBatches(); // Recarregar a lista de lotes após exclusão
        this.selectedBatchAnimals = []; // Limpar a tabela de animais
        this.showAnimals = false; // Ocultar a tabela de animais
        this.animalsVisibleBatchId = null; // Resetar o lote visível
        this.poModal.close(); // Fechar o modal após a exclusão
      }).catch(error => {
        console.error('Erro ao excluir o lote:', error);
        this.poNotification.error('Erro ao excluir o lote: ' + error.message);
        this.poModal.close(); // Garantir que o modal feche mesmo em caso de erro
      });
    }
  }
  

  toggleAnimalsView(batch: any) {
    if (this.animalsVisibleBatchId === batch.firestoreId) {
      // Se os animais desse lote já estão visíveis, ocultar
      this.showAnimals = false;
      this.animalsVisibleBatchId = null;
      this.selectedBatchAnimals = [];
      this.actions[0].label = 'Ver Animais';
    } else {
      // Se outro lote está visível, trocar para o novo lote
      this.selectedBatchAnimals = batch.animais || [];
      this.showAnimals = true;
      this.animalsVisibleBatchId = batch.firestoreId;
      this.actions[0].label = 'Ocultar Animais';
    }
  }
}
