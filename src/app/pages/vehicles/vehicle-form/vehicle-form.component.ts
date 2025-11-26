import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle, VehicleStatus, VehicleType } from '../../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss'
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  isEditMode = false;
  vehicleId: string | null = null;
  loading = false;
  error: string | null = null;

  vehicleTypes = Object.values(VehicleType);
  vehicleStatuses = Object.values(VehicleStatus);

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.vehicleForm = this.fb.group({
      licensePlate: ['', [Validators.required]],
      type: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1900)]],
      status: [VehicleStatus.AVAILABLE],
      currentMileage: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.vehicleId;

    if (this.isEditMode && this.vehicleId) {
      this.loadVehicle(this.vehicleId);
    }
  }

  loadVehicle(id: string): void {
    this.loading = true;
    this.vehicleService.getById(id).subscribe({
      next: (vehicle: Vehicle) => {
        this.vehicleForm.patchValue(vehicle);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar veículo';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    const vehicle: Vehicle = this.vehicleForm.value;

    const request = this.isEditMode && this.vehicleId
      ? this.vehicleService.update(this.vehicleId, vehicle)
      : this.vehicleService.create(vehicle);

    request.subscribe({
      next: () => {
        this.router.navigate(['/vehicles']);
      },
      error: (err: any) => {
        this.error = 'Erro ao salvar veículo';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getTypeLabel(type: VehicleType): string {
    const labels: Record<VehicleType, string> = {
      [VehicleType.CAR]: 'Carro',
      [VehicleType.TRUCK]: 'Caminhão',
      [VehicleType.VAN]: 'Van',
      [VehicleType.BUS]: 'Ônibus',
      [VehicleType.MOTORCYCLE]: 'Moto'
    };
    return labels[type];
  }

  getStatusLabel(status: VehicleStatus): string {
    const labels: Record<VehicleStatus, string> = {
      [VehicleStatus.AVAILABLE]: 'Disponível',
      [VehicleStatus.IN_USE]: 'Em Uso',
      [VehicleStatus.MAINTENANCE]: 'Manutenção',
      [VehicleStatus.UNAVAILABLE]: 'Indisponível'
    };
    return labels[status];
  }
}
