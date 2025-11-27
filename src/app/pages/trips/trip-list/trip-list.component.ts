import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../../models/trip.model';
import { TripService } from '../../../services/trip.service';
import { Vehicle } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';
import { Driver } from '../../../models/driver.model';
import { DriverService } from '../../../services/driver.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.scss'
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  loading = false;
  error: string | null = null;
  filterStatus: 'all' | 'scheduled' | 'in-progress' | 'completed' = 'all';
  selectedVehicleId: string = '';
  
  // Modal para completar viagem
  showCompleteModal = false;
  selectedTrip: Trip | null = null;
  completeForm = {
    endMileage: 0,
    notes: ''
  };

  constructor(
    private tripService: TripService,
    private vehicleService: VehicleService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadDrivers();
    this.loadTrips();
  }

  loadVehicles(): void {
    this.vehicleService.getAll().subscribe({
      next: (data: Vehicle[]) => {
        this.vehicles = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar veículos', err);
      }
    });
  }

  loadDrivers(): void {
    this.driverService.getAll().subscribe({
      next: (data: Driver[]) => {
        this.drivers = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar motoristas', err);
      }
    });
  }

  loadTrips(): void {
    this.loading = true;
    this.error = null;
    
    let request;
    
    // Filtro por veículo tem prioridade
    if (this.selectedVehicleId) {
      request = this.tripService.getByVehicleId(this.selectedVehicleId);
    } else if (this.filterStatus === 'scheduled') {
      request = this.tripService.getScheduledTrips();
    } else if (this.filterStatus === 'in-progress') {
      request = this.tripService.getInProgressTrips();
    } else if (this.filterStatus === 'completed') {
      request = this.tripService.getCompletedTrips();
    } else {
      request = this.tripService.getAll();
    }
    
    request.subscribe({
      next: (data: Trip[]) => {
        this.trips = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar viagens';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterByStatus(status: 'all' | 'scheduled' | 'in-progress' | 'completed'): void {
    this.filterStatus = status;
    this.selectedVehicleId = ''; // Limpar filtro de veículo
    this.loadTrips();
  }

  onStatusChange(): void {
    this.selectedVehicleId = '';
    this.loadTrips();
  }

  filterByVehicle(): void {
    this.filterStatus = 'all'; // Resetar filtro de status
    this.loadTrips();
  }

  clearFilters(): void {
    this.filterStatus = 'all';
    this.selectedVehicleId = '';
    this.loadTrips();
  }

  deleteTrip(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta viagem?')) {
      this.tripService.delete(id).subscribe({
        next: () => {
          this.loadTrips();
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir viagem';
          console.error(err);
        }
      });
    }
  }

  openCompleteModal(trip: Trip): void {
    this.selectedTrip = trip;
    this.completeForm.endMileage = trip.startMileage || 0;
    this.completeForm.notes = '';
    this.showCompleteModal = true;
  }

  closeCompleteModal(): void {
    this.showCompleteModal = false;
    this.selectedTrip = null;
  }

  completeTrip(): void {
    if (!this.selectedTrip) return;

    if (this.completeForm.endMileage <= (this.selectedTrip.startMileage || 0)) {
      alert('A quilometragem final deve ser maior que a inicial!');
      return;
    }

    this.loading = true;
    this.tripService.completeTrip(
      this.selectedTrip.id!,
      this.completeForm.endMileage,
      this.completeForm.notes
    ).subscribe({
      next: () => {
        this.closeCompleteModal();
        this.loadTrips();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao completar viagem';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getTripStatus(trip: Trip): string {
    if (trip.endDateTime) {
      return 'Finalizada';
    } else if (trip.startDateTime) {
      return 'Em Andamento';
    }
    return 'Agendada';
  }

  getTripStatusClass(trip: Trip): string {
    if (trip.endDateTime) {
      return 'status-completed';
    } else if (trip.startDateTime) {
      return 'status-in-progress';
    }
    return 'status-scheduled';
  }

  canCompleteTrip(trip: Trip): boolean {
    return !!trip.startDateTime && !trip.endDateTime;
  }

  getVehicleInfo(vehicleId: string): string {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      return `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}`;
    }
    return vehicleId;
  }

  getDriverInfo(driverId: string): string {
    const driver = this.drivers.find(d => d.id === driverId);
    if (driver) {
      return `${driver.name} - CNH: ${driver.cnh}`;
    }
    return driverId;
  }
}
