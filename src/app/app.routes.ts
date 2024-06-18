import { Routes } from '@angular/router';
import { AuthGuard, LoginRegisterGuard } from './services/auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';  
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterAnimalComponent } from './components/register-animal/register-animal.component';
import { AllAnimalsComponent } from './components/all-animals/all-animals.component';
import { OverviewComponent } from './components/overview/overview.component';
import { RegisterBatchComponent } from './components/register-batch/register-batch.component';
import { AllBatchesComponent } from './components/all-batches/all-batches.component'; // Importe o novo componente

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginRegisterGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoginRegisterGuard] },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'overview', component: OverviewComponent }, 
      { path: 'cadastrar', component: RegisterAnimalComponent },
      { path: 'animais', component: AllAnimalsComponent },
      { path: 'lotes', component: AllBatchesComponent } // Adicione a nova rota aqui
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
