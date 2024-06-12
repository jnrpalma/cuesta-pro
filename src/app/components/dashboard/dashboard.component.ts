import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoButtonModule, PoChartModule, PoChartType, PoLoadingModule } from '@po-ui/ng-components';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PoChartModule, PoButtonModule, PoLoadingModule],
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
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userName = user.firstName || user.email;
        console.log('User name set to:', this.userName);
      } else {
        this.userName = '';
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([`/dashboard/${route}`]);
  }

  logout() {
    this.isLoading = true;
    this.authService.logout().then(() => {
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      }, 1000);
    });
  }
}
