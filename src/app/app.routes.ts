import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ClienteDashboard } from './components/cliente-dashboard/cliente-dashboard';
import { ColaboradorDashboard } from './components/colaborador-dashboard/colaborador-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Ruta por defecto
  { path: 'login', component: LoginComponent },
  { path: 'cliente', component: ClienteDashboard },
  { path: 'colaborador', component: ColaboradorDashboard },
  // Ruta comodín para redirigir al login si escriben algo mal en la URL
  { path: '**', redirectTo: 'login' } 
];