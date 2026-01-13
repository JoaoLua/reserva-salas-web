import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';

import { SignupComponent } from './pages/singup/signup.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Reserva de Salas - Dashboard',
        canActivate: [authGuard]
    },
    {
        path: 'login', 
        component: LoginComponent,
        title: 'Login Reserva de Salas'
    },
    { 
        path: 'signup', 
        component: SignupComponent, 
        title: 'Cadastro - Sistema de Reservas' 
    },
    
];
