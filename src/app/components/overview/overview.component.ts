import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoChartModule, PoChartOptions, PoChartSerie, PoChartType, PoLoadingModule, PoTabsModule } from '@po-ui/ng-components';
import { BatchService } from '../../services/batch/batch.service';
import { Animal } from '../register-animal/interface/animal.interface';
import { Batch } from '../register-batch/interface/batch.interface';
import { firstValueFrom } from 'rxjs'; // Substituição do toPromise()
import { AnimalManagementService } from '../../services/animal/animal-management.service';

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
  totalChartSeries: PoChartSerie[] = [];
  breedChartSeries: PoChartSerie[] = []; 
  activeTab: string | null = null;

  constructor(
    private animalService: AnimalManagementService,
    private batchService: BatchService
  ) {}

  async ngOnInit() {
    try {
      await Promise.all([
        this.loadAnimals(),
        this.loadBatches()
      ]);
    } finally {
      this.isLoading = false;
    }
  }
  

  async loadAnimals() {
    try {
      const data = await firstValueFrom(this.animalService.getAllAnimals());
      this.animals = data;
      this.processCategoryChartData();
      this.processGenderChartData();
      this.processTotalChartData();
      this.processBreedChartData();
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
    } finally {
      this.isLoading = false;
    }
  }
  

  async loadBatches() {
    try {
      const data = await firstValueFrom(this.batchService.getBatches());
      this.batches = data;
    } catch (error) {
      console.error('Erro ao carregar lotes:', error);
    } finally {
      this.isLoading = false;
    }
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
      ['Fêmeas', 0],
      ['Outros', 0],
      ['Não Informado', 0] 
    ]);
  
    this.animals.forEach(animal => {
      if (animal.genero === 'MACHO') {
        genders.set('Machos', (genders.get('Machos') || 0) + 1);
      } else if (animal.genero === 'FEMEA') {
        genders.set('Fêmeas', (genders.get('Fêmeas') || 0) + 1);
      } else if (animal.genero === 'OUTROS') {
        genders.set('Outros', (genders.get('Outros') || 0) + 1);
      } else if (animal.genero === 'N/A') {
        genders.set('Não Informado', (genders.get('Não Informado') || 0) + 1);
      }
    });
  
    this.genderChartSeries = Array.from(genders.entries()).map(([label, data]) => ({
      label,
      data
    }));
  }

  async processTotalChartData() {
    const totalAlive = this.animals.length;

    try {
      const totalDeceased = await firstValueFrom(this.animalService.getDeceasedAnimalsCount());
      this.totalChartSeries = [
        { label: 'Total de Animais (Vivos)', data: totalAlive },
        { label: 'Total de Animais Mortos', data: totalDeceased }
      ];
    } catch (error) {
      console.error('Erro ao carregar contagem de animais mortos:', error);
    }
  }

  processBreedChartData() {
    const breeds = new Map<string, number>();
    this.animals.forEach(animal => {
      breeds.set(animal.raca, (breeds.get(animal.raca) || 0) + 1);
    });

    this.breedChartSeries = Array.from(breeds.entries()).map(([label, data]) => ({
      label,
      data
    }));
  }

  toggleTab(tabName: string) {
    this.activeTab = this.activeTab === tabName ? null : tabName;
  }
}
