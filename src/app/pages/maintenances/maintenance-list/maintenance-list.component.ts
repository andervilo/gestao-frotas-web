import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Maintenance, MaintenanceStatus, MaintenanceType, MaintenanceFilter } from '../../../models/maintenance.model';
import { MaintenanceService } from '../../../services/maintenance.service';
import { Vehicle } from '../../../models/vehicle.model';
import { VehicleService } from '../../../services/vehicle.service';
import { PagedResponse } from '../../../models/driver.model';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './maintenance-list.component.html',
  styleUrl: './maintenance-list.component.scss'
})
export class MaintenanceListComponent implements OnInit {
  maintenances: Maintenance[] = [];
  vehicles: Vehicle[] = [];
  loading = false;
  error: string | null = null;
  showFilters = false;

  MaintenanceStatus = MaintenanceStatus;
  MaintenanceType = MaintenanceType;
  
  // Paginação
  currentPage = 0;
  pageSize = 10;
  pageSizes = [5, 10, 20, 50];
  totalPages = 0;
  totalElements = 0;
  
  // Filtros
  filter: MaintenanceFilter = {};
  sortBy = 'scheduledDate';
  direction = 'DESC';

  // Modal para ações
  showActionModal = false;
  modalAction: 'start' | 'complete' | 'cancel' | null = null;
  selectedMaintenance: Maintenance | null = null;
  
  // Formulários dos modais
  completeForm = {
    finalCost: 0,
    notes: ''
  };
  
  cancelForm = {
    reason: ''
  };

  // Modal de visualização
  showViewModal = false;
  selectedViewMaintenance: Maintenance | null = null;

  constructor(
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadMaintenances();
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

  loadMaintenances(): void {
    this.loading = true;
    this.error = null;
    
    this.maintenanceService.getAll(this.filter, this.currentPage, this.pageSize, this.sortBy, this.direction).subscribe({
      next: (response: PagedResponse<Maintenance>) => {
        this.maintenances = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar manutenções';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadMaintenances();
  }

  clearFilters(): void {
    this.filter = {};
    this.currentPage = 0;
    this.loadMaintenances();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMaintenances();
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadMaintenances();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.direction = this.direction === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = field;
      this.direction = 'ASC';
    }
    this.loadMaintenances();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
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

  openActionModal(action: 'start' | 'complete' | 'cancel', maintenance: Maintenance): void {
    this.selectedMaintenance = maintenance;
    this.modalAction = action;
    
    if (action === 'complete') {
      this.completeForm.finalCost = maintenance.cost || 0;
      this.completeForm.notes = '';
    } else if (action === 'cancel') {
      this.cancelForm.reason = '';
    }
    
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.modalAction = null;
    this.selectedMaintenance = null;
  }

  executeAction(): void {
    if (!this.selectedMaintenance) return;

    this.loading = true;
    let request;

    switch (this.modalAction) {
      case 'start':
        request = this.maintenanceService.startMaintenance(this.selectedMaintenance.id!);
        break;
      case 'complete':
        if (this.completeForm.finalCost <= 0) {
          alert('O custo final deve ser maior que zero!');
          this.loading = false;
          return;
        }
        request = this.maintenanceService.completeMaintenance(
          this.selectedMaintenance.id!,
          this.completeForm.finalCost,
          this.completeForm.notes
        );
        break;
      case 'cancel':
        if (!this.cancelForm.reason.trim()) {
          alert('Informe o motivo do cancelamento!');
          this.loading = false;
          return;
        }
        request = this.maintenanceService.cancelMaintenance(
          this.selectedMaintenance.id!,
          this.cancelForm.reason
        );
        break;
      default:
        this.loading = false;
        return;
    }

    request.subscribe({
      next: () => {
        this.closeActionModal();
        this.loadMaintenances();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao executar ação';
        this.loading = false;
        console.error(err);
      }
    });
  }

  canStart(maintenance: Maintenance): boolean {
    return maintenance.status === MaintenanceStatus.SCHEDULED;
  }

  canComplete(maintenance: Maintenance): boolean {
    return maintenance.status === MaintenanceStatus.IN_PROGRESS;
  }

  canCancel(maintenance: Maintenance): boolean {
    return maintenance.status === MaintenanceStatus.SCHEDULED || 
           maintenance.status === MaintenanceStatus.IN_PROGRESS;
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

  getModalTitle(): string {
    switch (this.modalAction) {
      case 'start': return 'Iniciar Manutenção';
      case 'complete': return 'Concluir Manutenção';
      case 'cancel': return 'Cancelar Manutenção';
      default: return '';
    }
  }

  getVehicleInfo(vehicleId: string): string {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      return `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}`;
    }
    return vehicleId;
  }

  viewMaintenance(maintenance: Maintenance): void {
    this.selectedViewMaintenance = maintenance;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedViewMaintenance = null;
  }
}
