import { Routes } from '@angular/router';
import { AuthGuard, LoginRegisterGuard } from './services/auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';  
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterAnimalComponent } from './components/register-animal/register-animal.component';
import { ListAnimalsComponent } from './components/list-animals/list-animals.component';
import { OverviewComponent } from './components/overview/overview.component'; // Importe o componente Overview

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginRegisterGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginRegisterGuard] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'overview', component: OverviewComponent }, // Adicione a rota overview
      { path: 'cadastrar', component: RegisterAnimalComponent },
      { path: 'animais', component: ListAnimalsComponent } // Adicione a rota para listar animais
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
