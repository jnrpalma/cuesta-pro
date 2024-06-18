import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListViewModule, PoInfoModule, PoLoadingModule } from '@po-ui/ng-components';
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

  constructor(private batchService: BatchService) {}

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
}
