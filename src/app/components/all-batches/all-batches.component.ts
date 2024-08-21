import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListViewModule, PoInfoModule, PoLoadingModule, PoNotificationService, PoModalModule, PoModalComponent, PoButtonModule } from '@po-ui/ng-components';
import { BatchService } from '../../services/batch/batch.service';

@Component({
  selector: 'app-all-batches',
  standalone: true,
  imports: [CommonModule, PoListViewModule, PoInfoModule, PoLoadingModule, PoModalModule, PoButtonModule],
  templateUrl: './all-batches.component.html',
  styleUrls: ['./all-batches.component.css']
})
export class AllBatchesComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  batches: any[] = [];
  isLoading: boolean = false;
  batchToDelete: any;

  actions = [
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.confirmDelete.bind(this)
    }
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
    this.poModal.open(); // Abrir modal de confirmação de exclusão
  }

  deleteBatch() {
    if (this.batchToDelete) {
      this.batchService.deleteBatch(this.batchToDelete.firestoreId).then(() => {
        this.poNotification.success('Lote excluído com sucesso!');
        this.loadBatches(); // Recarregar a lista de lotes após exclusão
        this.poModal.close(); // Fechar o modal após exclusão
      }).catch(error => {
        console.error('Erro ao excluir o lote:', error);
        this.poNotification.error('Erro ao excluir o lote: ' + error.message);
        this.poModal.close(); // Fechar o modal mesmo em caso de erro
      });
    }
  }
}
