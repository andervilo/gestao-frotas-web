import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../../models/maintenance.model';
import { MaintenanceService } from '../../../services/maintenance.service';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './maintenance-list.component.html',
  styleUrl: './maintenance-list.component.scss'
})
export class MaintenanceListComponent implements OnInit {
  maintenances: Maintenance[] = [];
  loading = false;
  error: string | null = null;

  MaintenanceStatus = MaintenanceStatus;
  MaintenanceType = MaintenanceType;

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.loadMaintenances();
  }

  loadMaintenances(): void {
    this.loading = true;
    this.error = null;
    this.maintenanceService.getAll().subscribe({
      next: (data: Maintenance[]) => {
        this.maintenances = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar manutenções';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteMaintenance(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
      this.maintenanceService.delete(id).subscribe({
        next: () => {
          this.loadMaintenances();
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir manutenção';
          console.error(err);
        }
      });
    }
  }

  getStatusClass(status?: MaintenanceStatus): string {
    switch (status) {
      case MaintenanceStatus.SCHEDULED:
        return 'status-scheduled';
      case MaintenanceStatus.IN_PROGRESS:
        return 'status-in-progress';
      case MaintenanceStatus.COMPLETED:
        return 'status-completed';
      case MaintenanceStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusLabel(status?: MaintenanceStatus): string {
    switch (status) {
      case MaintenanceStatus.SCHEDULED:
        return 'Agendada';
      case MaintenanceStatus.IN_PROGRESS:
        return 'Em Progresso';
      case MaintenanceStatus.COMPLETED:
        return 'Concluída';
      case MaintenanceStatus.CANCELLED:
        return 'Cancelada';
      default:
        return '-';
    }
  }

  getTypeLabel(type: MaintenanceType): string {
    switch (type) {
      case MaintenanceType.PREVENTIVE:
        return 'Preventiva';
      case MaintenanceType.CORRECTIVE:
        return 'Corretiva';
      case MaintenanceType.INSPECTION:
        return 'Inspeção';
      case MaintenanceType.REPAIR:
        return 'Reparo';
      default:
        return type;
    }
  }
}
