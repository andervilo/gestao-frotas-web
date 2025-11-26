import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Vehicle, VehicleStatus, VehicleType } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = false;
  error: string | null = null;

  VehicleStatus = VehicleStatus;
  VehicleType = VehicleType;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.error = null;
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar veículos';
        this.loading = false;
        console.error(err);
      }
    });
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
        return type;
    }
  }
}
