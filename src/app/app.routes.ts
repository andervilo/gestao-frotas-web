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
import { CostReportComponent } from './pages/reports/cost-report/cost-report.component';
import { FleetUtilizationReportComponent } from './pages/reports/fleet-utilization-report/fleet-utilization-report.component';
import { MaintenanceReportComponent } from './components/maintenance-report/maintenance-report.component';
import { CorrectiveMaintenanceReportComponent } from './components/corrective-maintenance-report/corrective-maintenance-report.component';
import { DriverPerformanceReportComponent } from './components/driver-performance-report/driver-performance-report.component';
import { TripReportComponent } from './components/trip-report/trip-report.component';
import { DepreciationReportComponent } from './components/depreciation-report/depreciation-report.component';

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
  
  // Reports
  { path: 'reports/costs', component: CostReportComponent },
  { path: 'reports/fleet-utilization', component: FleetUtilizationReportComponent },
  { path: 'reports/maintenance', component: MaintenanceReportComponent },
  { path: 'reports/corrective-maintenance', component: CorrectiveMaintenanceReportComponent },
  { path: 'reports/driver-performance', component: DriverPerformanceReportComponent },
  { path: 'reports/trips', component: TripReportComponent },
  { path: 'reports/depreciation', component: DepreciationReportComponent },
];
