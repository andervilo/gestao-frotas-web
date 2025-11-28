import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Vehicle, VehicleStatus, VehicleType, VehicleFilter } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';
import { PagedResponse } from '../../../models/driver.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = false;
  error: string | null = null;

  // Paginação
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  pageSizes = [5, 10, 20, 50];

  // Ordenação
  sortField = 'licensePlate';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filtros
  filters: VehicleFilter = {};
  showFilters = false;

  VehicleStatus = VehicleStatus;
  VehicleType = VehicleType;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.error = null;
    
    this.vehicleService.getAll(this.filters, this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (response: PagedResponse<Vehicle>) => {
        this.vehicles = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar veículos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadVehicles();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 0;
    this.loadVehicles();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadVehicles();
    }
  }

  changePageSize(): void {
    this.currentPage = 0;
    this.loadVehicles();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadVehicles();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'fas fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    
    let start = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages);
    
    if (end - start < maxPages) {
      start = Math.max(0, end - maxPages);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  deleteVehicle(id: string): void {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      this.vehicleService.delete(id).subscribe({
        next: () => {
          this.loadVehicles();
        },
        error: (err) => {
          this.error = 'Erro ao excluir veículo';
          console.error(err);
        }
      });
    }
  }

  getStatusClass(status?: VehicleStatus): string {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'status-available';
      case VehicleStatus.IN_USE:
        return 'status-in-use';
      case VehicleStatus.MAINTENANCE:
        return 'status-maintenance';
      case VehicleStatus.UNAVAILABLE:
        return 'status-unavailable';
      default:
        return '';
    }
  }

  getStatusLabel(status?: VehicleStatus): string {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return 'Disponível';
      case VehicleStatus.IN_USE:
        return 'Em Uso';
      case VehicleStatus.MAINTENANCE:
        return 'Manutenção';
      case VehicleStatus.UNAVAILABLE:
        return 'Indisponível';
      default:
        return '-';
    }
  }

  getTypeLabel(type: VehicleType): string {
    switch (type) {
      case VehicleType.CAR:
        return 'Carro';
      case VehicleType.TRUCK:
        return 'Caminhão';
      case VehicleType.VAN:
        return 'Van';
      case VehicleType.BUS:
        return 'Ônibus';
      case VehicleType.MOTORCYCLE:
        return 'Moto';
      default:
        return '-';
    }
  }
}
