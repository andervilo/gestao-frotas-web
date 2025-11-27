import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TripService } from '../../../services/trip.service';
import { VehicleService } from '../../../services/vehicle.service';
import { DriverService } from '../../../services/driver.service';
import { Trip } from '../../../models/trip.model';
import { Vehicle } from '../../../models/vehicle.model';
import { Driver, PagedResponse } from '../../../models/driver.model';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.scss'
})
export class TripFormComponent implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  tripId: string | null = null;
  loading = false;
  error: string | null = null;

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tripForm = this.fb.group({
      vehicleId: ['', [Validators.required]],
      driverId: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      startDateTime: [''],
      endDateTime: [''],
      startMileage: [0, [Validators.required, Validators.min(0)]],
      endMileage: [0, [Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadDrivers();

    this.tripId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.tripId;

    if (this.isEditMode && this.tripId) {
      this.loadTrip(this.tripId);
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

  loadTrip(id: string): void {
    this.loading = true;
    this.tripService.getById(id).subscribe({
      next: (trip: Trip) => {
        const formattedTrip = {
          ...trip,
          startDateTime: trip.startDateTime ? this.formatDateTimeForInput(trip.startDateTime) : '',
          endDateTime: trip.endDateTime ? this.formatDateTimeForInput(trip.endDateTime) : ''
        };
        this.tripForm.patchValue(formattedTrip);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar viagem';
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
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const trip: Trip = {
      ...this.tripForm.value,
      distanceTraveled: this.calculateDistance()
    };

    const request = this.isEditMode && this.tripId
      ? this.tripService.update(this.tripId, trip)
      : this.tripService.create(trip);

    request.subscribe({
      next: () => {
        this.router.navigate(['/trips']);
      },
      error: (err: any) => {
        this.error = 'Erro ao salvar viagem';
        this.loading = false;
        console.error(err);
      }
    });
  }

  calculateDistance(): number | undefined {
    const startMileage = this.tripForm.get('startMileage')?.value;
    const endMileage = this.tripForm.get('endMileage')?.value;
    
    if (endMileage && startMileage && endMileage > startMileage) {
      return endMileage - startMileage;
    }
    return undefined;
  }

  getVehicleLabel(vehicle: Vehicle): string {
    return `${vehicle.licensePlate} - ${vehicle.brand} ${vehicle.model}`;
  }
}
