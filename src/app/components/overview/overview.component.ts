import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoChartModule, PoChartType, PoChartOptions, PoChartSerie, PoLoadingModule } from '@po-ui/ng-components';
import { AnimalService } from '../../services/animal/animal.service';
import { Animal } from '../register-animal/interface/animal.interface';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, PoChartModule, PoLoadingModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  animals: Animal[] = [];
  isLoading = true;
  chartType: PoChartType = PoChartType.Pie; // Define o tipo de gráfico como Pie
  chartOptions: PoChartOptions = {
    legend: true
  };
  chartSeries: PoChartSerie[] = [];

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    this.animalService.getAnimals().subscribe((data: Animal[]) => {
      this.animals = data;
      this.processChartData();
      this.isLoading = false;
    }, error => {
      console.error('Erro ao carregar animais:', error);
      this.isLoading = false;
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
