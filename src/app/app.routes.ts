import { Routes } from '@angular/router';
import { AuthGuard, LoginRegisterGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';  
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterAnimalComponent } from './components/register-animal/register-animal.component';
// import { OverviewComponent } from './components/overview/overview.component';
// import { AnimaisComponent } from './components/animais/animais.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginRegisterGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginRegisterGuard] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      // { path: 'overview', component: OverviewComponent },
      // { path: 'animais', component: AnimaisComponent },
      { path: 'cadastrar', component: RegisterAnimalComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
