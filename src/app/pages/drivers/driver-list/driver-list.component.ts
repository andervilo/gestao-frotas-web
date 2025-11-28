import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Driver, DriverStatus, DriverFilter, PagedResponse } from '../../../models/driver.model';
import { DriverService } from '../../../services/driver.service';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.scss'
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [];
  loading = false;
  error: string | null = null;

  // Paginação
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  pageSizes = [5, 10, 20, 50];

  // Ordenação
  sortField = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filtros
  filters: DriverFilter = {};
  showFilters = false;

  DriverStatus = DriverStatus;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.loading = true;
    this.error = null;
    
    this.driverService.getAll(this.filters, this.currentPage, this.pageSize, this.sortField, this.sortDirection).subscribe({
      next: (response: PagedResponse<Driver>) => {
        this.drivers = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar motoristas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadDrivers();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 0;
    this.loadDrivers();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadDrivers();
    }
  }

  changePageSize(): void {
    this.currentPage = 0;
    this.loadDrivers();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadDrivers();
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

  deleteDriver(id: string): void {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
      this.driverService.delete(id).subscribe({
        next: () => {
          this.loadDrivers();
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir motorista';
          console.error(err);
        }
      });
    }
  }

  getStatusClass(status?: DriverStatus): string {
    switch (status) {
      case DriverStatus.ACTIVE:
        return 'status-active';
      case DriverStatus.INACTIVE:
        return 'status-inactive';
      case DriverStatus.ON_LEAVE:
        return 'status-vacation';
      case DriverStatus.SUSPENDED:
        return 'status-suspended';
      default:
        return '';
    }
  }

  getStatusLabel(status?: DriverStatus): string {
    switch (status) {
      case DriverStatus.ACTIVE:
        return 'Ativo';
      case DriverStatus.INACTIVE:
        return 'Inativo';
      case DriverStatus.ON_LEAVE:
        return 'Em Férias';
      case DriverStatus.SUSPENDED:
        return 'Suspenso';
      default:
        return '-';
    }
  }

  isCnhExpired(expirationDate: string): boolean {
    return new Date(expirationDate) < new Date();
  }
}
