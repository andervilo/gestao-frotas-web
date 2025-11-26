import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VehicleListComponent } from './pages/vehicles/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './pages/vehicles/vehicle-form/vehicle-form.component';
import { DriverListComponent } from './pages/drivers/driver-list/driver-list.component';
import { DriverFormComponent } from './pages/drivers/driver-form/driver-form.component';
import { TripListComponent } from './pages/trips/trip-list/trip-list.component';
import { TripFormComponent } from './pages/trips/trip-form/trip-form.component';
import { MaintenanceListComponent } from './pages/maintenances/maintenance-list/maintenance-list.component';
import { MaintenanceFormComponent } from './pages/maintenances/maintenance-form/maintenance-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  // Vehicles
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicles/new', component: VehicleFormComponent },
  { path: 'vehicles/:id/edit', component: VehicleFormComponent },
  
  // Drivers
  { path: 'drivers', component: DriverListComponent },
  { path: 'drivers/new', component: DriverFormComponent },
  { path: 'drivers/:id/edit', component: DriverFormComponent },
  
  // Trips
  { path: 'trips', component: TripListComponent },
  { path: 'trips/new', component: TripFormComponent },
  { path: 'trips/:id/edit', component: TripFormComponent },
  
  // Maintenances
  { path: 'maintenances', component: MaintenanceListComponent },
  { path: 'maintenances/new', component: MaintenanceFormComponent },
  { path: 'maintenances/:id/edit', component: MaintenanceFormComponent },
];
