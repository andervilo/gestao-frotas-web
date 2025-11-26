import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaintenanceService } from '../../../services/maintenance.service';
import { VehicleService } from '../../../services/vehicle.service';
import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../../models/maintenance.model';
import { Vehicle } from '../../../models/vehicle.model';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './maintenance-form.component.html',
  styleUrl: './maintenance-form.component.scss'
})
export class MaintenanceFormComponent implements OnInit {
  maintenanceForm: FormGroup;
  isEditMode = false;
  maintenanceId: string | null = null;
  loading = false;
  error: string | null = null;

  vehicles: Vehicle[] = [];
  maintenanceTypes = Object.values(MaintenanceType);
  maintenanceStatuses = Object.values(MaintenanceStatus);

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.maintenanceForm = this.fb.group({
      vehicleId: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      cost: [0],
      scheduledDate: ['', [Validators.required]],
      startDate: [''],
      completionDate: [''],
      status: [MaintenanceStatus.SCHEDULED],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadVehicles();

    this.maintenanceId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.maintenanceId;

    if (this.isEditMode && this.maintenanceId) {
      this.loadMaintenance(this.maintenanceId);
    }
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

  loadMaintenance(id: string): void {
    this.loading = true;
    this.maintenanceService.getById(id).subscribe({
      next: (maintenance: Maintenance) => {
        const formattedMaintenance = {
          ...maintenance,
          scheduledDate: maintenance.scheduledDate ? this.formatDateTimeForInput(maintenance.scheduledDate) : '',
          startDate: maintenance.startDate ? this.formatDateTimeForInput(maintenance.startDate) : '',
          completionDate: maintenance.completionDate ? this.formatDateTimeForInput(maintenance.completionDate) : ''
        };
        this.maintenanceForm.patchValue(formattedMaintenance);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar manutenção';
        this.loading = false;
        console.error(err);
      }
    });
  }

  formatDateTimeForInput(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    const maintenance: Maintenance = this.maintenanceForm.value;

    const request = this.isEditMode && this.maintenanceId
      ? this.maintenanceService.update(this.maintenanceId, maintenance)
      : this.maintenanceService.create(maintenance);

    request.subscribe({
      next: () => {
        this.router.navigate(['/maintenances']);
      },
      error: (err: any) => {
        this.error = 'Erro ao salvar manutenção';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getVehicleLabel(vehicle: Vehicle): string {
    return `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}`;
  }

  getTypeLabel(type: MaintenanceType): string {
    const labels: Record<MaintenanceType, string> = {
      [MaintenanceType.PREVENTIVE]: 'Preventiva',
      [MaintenanceType.CORRECTIVE]: 'Corretiva',
      [MaintenanceType.INSPECTION]: 'Inspeção',
      [MaintenanceType.REPAIR]: 'Reparo'
    };
    return labels[type];
  }

  getStatusLabel(status: MaintenanceStatus): string {
    const labels: Record<MaintenanceStatus, string> = {
      [MaintenanceStatus.SCHEDULED]: 'Agendada',
      [MaintenanceStatus.IN_PROGRESS]: 'Em Progresso',
      [MaintenanceStatus.COMPLETED]: 'Concluída',
      [MaintenanceStatus.CANCELLED]: 'Cancelada'
    };
    return labels[status];
  }
}
