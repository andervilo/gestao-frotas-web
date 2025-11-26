import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { Driver, DriverStatus } from '../../../models/driver.model';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.scss'
})
export class DriverFormComponent implements OnInit {
  driverForm: FormGroup;
  isEditMode = false;
  driverId: string | null = null;
  loading = false;
  error: string | null = null;

  driverStatuses = Object.values(DriverStatus);

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.driverForm = this.fb.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      cnh: ['', [Validators.required]],
      cnhCategory: ['', [Validators.required]],
      cnhExpirationDate: ['', [Validators.required]],
      status: [DriverStatus.ACTIVE]
    });
  }

  ngOnInit(): void {
    this.driverId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.driverId;

    if (this.isEditMode && this.driverId) {
      this.loadDriver(this.driverId);
    }
  }

  loadDriver(id: string): void {
    this.loading = true;
    this.driverService.getById(id).subscribe({
      next: (driver: Driver) => {
        // Converter data para formato yyyy-MM-dd para o input
        const formattedDriver = {
          ...driver,
          cnhExpirationDate: driver.cnhExpirationDate ? driver.cnhExpirationDate.split('T')[0] : ''
        };
        this.driverForm.patchValue(formattedDriver);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar motorista';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    const driver: Driver = this.driverForm.value;

    const request = this.isEditMode && this.driverId
      ? this.driverService.update(this.driverId, driver)
      : this.driverService.create(driver);

    request.subscribe({
      next: () => {
        this.router.navigate(['/drivers']);
      },
      error: (err: any) => {
        this.error = 'Erro ao salvar motorista';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getStatusLabel(status: DriverStatus): string {
    const labels: Record<DriverStatus, string> = {
      [DriverStatus.ACTIVE]: 'Ativo',
      [DriverStatus.INACTIVE]: 'Inativo',
      [DriverStatus.ON_LEAVE]: 'Em Férias',
      [DriverStatus.SUSPENDED]: 'Suspenso'
    };
    return labels[status];
  }
}
