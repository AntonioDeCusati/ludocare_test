import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LoginComponent } from '../../login/login.component';
import { SlotMachineComponent } from '../../slot-machine/slot-machine.component';
import { OnInit } from '@angular/core';

export const AdminLayoutRoutes: Routes = [
    
    { path: 'login',        component: LoginComponent },
    { path: 'slot-machine',      component: SlotMachineComponent },
    { path: 'dashboard',      component: DashboardComponent }
];
