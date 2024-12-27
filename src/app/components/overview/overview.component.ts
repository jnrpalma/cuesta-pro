import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoChartModule, PoChartType, PoChartOptions, PoChartSerie, PoLoadingModule, PoTabsModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { BatchService } from '../../services/batch/batch.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { Batch } from '../register-batch/interface/batch.interface';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, PoChartModule, PoLoadingModule, PoTabsModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  animals: Animal[] = [];
  batches: Batch[] = [];
  isLoading = true;

  chartType: PoChartType = PoChartType.Pie;
  chartOptions: PoChartOptions = { legend: true };

  categoryChartSeries: PoChartSerie[] = [];
  genderChartSeries: PoChartSerie[] = [];
  
  activeTab: string | null = null; // Aba ativa

  constructor(
    private animalService: AnimalService,
    private batchService: BatchService
  ) {}

  ngOnInit() {
    this.loadAnimals();
    this.loadBatches();
  }

  loadAnimals() {
    this.animalService.getAllAnimals().subscribe(
      (data: Animal[]) => {
        this.animals = data;
        this.processCategoryChartData();
        this.processGenderChartData();
        this.isLoading = false;
      },
      error => {
        console.error('Erro ao carregar animais:', error);
        this.isLoading = false;
      }
    );
  }

  loadBatches() {
    this.batchService.getBatches().subscribe(
      (data: Batch[]) => {
        this.batches = data;
        console.log('Batches:', this.batches);
      },
      error => {
        console.error('Erro ao carregar lotes:', error);
      }
    );
  }

  processCategoryChartData() {
    const categories = new Map<string, number>();
    this.animals.forEach(animal => {
      categories.set(animal.categoria, (categories.get(animal.categoria) || 0) + 1);
    });

    this.categoryChartSeries = Array.from(categories.entries()).map(([label, data]) => ({
      label,
      data
    }));
  }

  processGenderChartData() {
    const genders = new Map<string, number>([
      ['Machos', 0],
      ['Fêmeas', 0]
    ]);

    this.animals.forEach(animal => {
      if (animal.genero === 'MACHO') {
        genders.set('Machos', (genders.get('Machos') || 0) + 1);
      } else if (animal.genero === 'FEMEA') {
        genders.set('Fêmeas', (genders.get('Fêmeas') || 0) + 1);
      }
    });

    this.genderChartSeries = Array.from(genders.entries()).map(([label, data]) => ({
      label,
      data
    }));
  }

  toggleTab(tabName: string) {
    this.activeTab = this.activeTab === tabName ? null : tabName;
  }
}
