import { Component } from '@angular/core';
import { PoChartModule, PoChartType } from '@po-ui/ng-components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PoChartModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  chartTypeLine: PoChartType = PoChartType.Line;
  chartTypePie: PoChartType = PoChartType.Pie;
  chartTypeColumn: PoChartType = PoChartType.Column;
  chartTypeDonut: PoChartType = PoChartType.Donut;
  chartTypeBar: PoChartType = PoChartType.Bar;
}
