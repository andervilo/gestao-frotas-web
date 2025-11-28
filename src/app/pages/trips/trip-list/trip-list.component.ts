import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trip, TripFilter } from '../../../models/trip.model';
import { TripService } from '../../../services/trip.service';
import { Vehicle } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';
import { Driver, PagedResponse } from '../../../models/driver.model';
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
  showFilters = false;
  
  // Paginação
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  
  // Filtros
  filter: TripFilter = {};
  sortBy = 'startDateTime';
  direction = 'DESC';
  
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
      next: (response: PagedResponse<Vehicle>) => {
        this.vehicles = response.content;
      },
      error: (err: any) => {
        console.error('Erro ao carregar veículos', err);
      }
    });
  }

  loadDrivers(): void {
    this.driverService.getAll().subscribe({
      next: (response: PagedResponse<Driver>) => {
        this.drivers = response.content;
      },
      error: (err: any) => {
        console.error('Erro ao carregar motoristas', err);
      }
    });
  }

  loadTrips(): void {
    this.loading = true;
    this.error = null;
    
    this.tripService.getAll(this.filter, this.currentPage, this.pageSize, this.sortBy, this.direction).subscribe({
      next: (response: PagedResponse<Trip>) => {
        this.trips = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar viagens';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadTrips();
  }

  clearFilters(): void {
    this.filter = {};
    this.currentPage = 0;
    this.loadTrips();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTrips();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadTrips();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.direction = this.direction === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = field;
      this.direction = 'ASC';
    }
    this.loadTrips();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
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
