import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListViewModule, PoInfoModule, PoLoadingModule, PoNotificationService } from '@po-ui/ng-components';
import { BatchService } from '../../services/batch/batch.service';

@Component({
  selector: 'app-all-batches',
  standalone: true,
  imports: [CommonModule, PoListViewModule, PoInfoModule, PoLoadingModule],
  templateUrl: './all-batches.component.html',
  styleUrls: ['./all-batches.component.css']
})
export class AllBatchesComponent implements OnInit {
  batches: any[] = [];
  isLoading: boolean = false;

  actions = [
    {
      label: 'Excluir',
      icon: 'po-icon-delete',
      type: 'danger',
      action: this.deleteBatch.bind(this)
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

  deleteBatch(batch: any) {
    if (confirm(`Tem certeza de que deseja excluir o lote "${batch.nomeLote}"?`)) {
      this.batchService.deleteBatch(batch.firestoreId).then(() => {
        this.poNotification.success('Lote excluído com sucesso!');
        this.loadBatches(); // Recarregar a lista de lotes após exclusão
      }).catch(error => {
        console.error('Erro ao excluir o lote:', error);
        this.poNotification.error('Erro ao excluir o lote: ' + error.message);
      });
    }
  }
}
