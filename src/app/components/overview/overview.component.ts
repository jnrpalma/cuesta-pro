import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoChartModule, PoChartType, PoChartOptions, PoChartSerie, PoLoadingModule, PoListViewModule, PoInfoModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { BatchService } from '../../services/batch/batch.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { Batch } from '../register-batch/interface/batch.interface';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, PoChartModule, PoLoadingModule, PoListViewModule, PoInfoModule ],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  animals: Animal[] = [];
  batches: Batch[] = [];
  isLoading = true;
  chartType: PoChartType = PoChartType.Pie; 
  chartOptions: PoChartOptions = {
    legend: true
  };
  chartSeries: PoChartSerie[] = [];

  constructor(
    private animalService: AnimalService,
    private batchService: BatchService
  ) {}

  ngOnInit() {
    this.loadAnimals();
    this.loadBatches();
  }

  loadAnimals() {
    this.animalService.getAnimals().subscribe((data: Animal[]) => {
      this.animals = data;
      this.processChartData();
      this.isLoading = false;
    }, error => {
      console.error('Erro ao carregar animais:', error);
      this.isLoading = false;
    });
  }

  loadBatches() {
    this.batchService.getBatches().subscribe((data: Batch[]) => {
      this.batches = data;
      console.log('Batches:', this.batches);
    }, error => {
      console.error('Erro ao carregar lotes:', error);
    });
  }

  processChartData() {
    const categorias = new Map<string, number>();

    this.animals.forEach(animal => {
      categorias.set(animal.categoria, (categorias.get(animal.categoria) || 0) + 1);
    });

    this.chartSeries = Array.from(categorias.entries()).map(([label, data]) => ({
      label,
      data
    }));
  }
}
