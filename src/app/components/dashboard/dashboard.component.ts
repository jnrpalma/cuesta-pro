import { Component, OnInit } from '@angular/core';
import { PoChartModule, PoChartType } from '@po-ui/ng-components';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PoChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chartTypeLine: PoChartType = PoChartType.Line;
  chartTypePie: PoChartType = PoChartType.Pie;
  chartTypeColumn: PoChartType = PoChartType.Column;
  chartTypeDonut: PoChartType = PoChartType.Donut;
  chartTypeBar: PoChartType = PoChartType.Bar;
  userName: string = 'John Doe';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userName = user.displayName || user.email;
      }
    });
  }
}
