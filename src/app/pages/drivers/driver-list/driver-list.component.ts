import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Driver, DriverStatus } from '../../../models/driver.model';
import { DriverService } from '../../../services/driver.service';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.scss'
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [];
  loading = false;
  error: string | null = null;

  DriverStatus = DriverStatus;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.loading = true;
    this.error = null;
    this.driverService.getAll().subscribe({
      next: (data: Driver[]) => {
        this.drivers = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar motoristas';
        this.loading = false;
        console.error(err);
      }
    });
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
