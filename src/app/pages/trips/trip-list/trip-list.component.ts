import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../../models/trip.model';
import { TripService } from '../../../services/trip.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.scss'
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];
  loading = false;
  error: string | null = null;
  filterType: 'all' | 'in-progress' | 'completed' = 'all';
  
  // Modal para completar viagem
  showCompleteModal = false;
  selectedTrip: Trip | null = null;
  completeForm = {
    endMileage: 0,
    notes: ''
  };

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.error = null;
    
    let request;
    if (this.filterType === 'in-progress') {
      request = this.tripService.getInProgressTrips();
    } else {
      request = this.tripService.getAll();
    }
    
    request.subscribe({
      next: (data: Trip[]) => {
        if (this.filterType === 'completed') {
          this.trips = data.filter(trip => trip.endDateTime !== null);
        } else {
          this.trips = data;
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar viagens';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterTrips(type: 'all' | 'in-progress' | 'completed'): void {
    this.filterType = type;
    this.loadTrips();
  }

  deleteTrip(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta viagem?')) {
      this.tripService.delete(id).subscribe({
        next: () => {
          this.loadTrips();
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir viagem';
          console.error(err);
        }
      });
    }
  }

  openCompleteModal(trip: Trip): void {
    this.selectedTrip = trip;
    this.completeForm.endMileage = trip.startMileage || 0;
    this.completeForm.notes = '';
    this.showCompleteModal = true;
  }

  closeCompleteModal(): void {
    this.showCompleteModal = false;
    this.selectedTrip = null;
  }

  completeTrip(): void {
    if (!this.selectedTrip) return;

    if (this.completeForm.endMileage <= (this.selectedTrip.startMileage || 0)) {
      alert('A quilometragem final deve ser maior que a inicial!');
      return;
    }

    this.loading = true;
    this.tripService.completeTrip(
      this.selectedTrip.id!,
      this.completeForm.endMileage,
      this.completeForm.notes
    ).subscribe({
      next: () => {
        this.closeCompleteModal();
        this.loadTrips();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao completar viagem';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getTripStatus(trip: Trip): string {
    if (trip.endDateTime) {
      return 'Finalizada';
    } else if (trip.startDateTime) {
      return 'Em Andamento';
    }
    return 'Agendada';
  }

  getTripStatusClass(trip: Trip): string {
    if (trip.endDateTime) {
      return 'status-completed';
    } else if (trip.startDateTime) {
      return 'status-in-progress';
    }
    return 'status-scheduled';
  }

  canCompleteTrip(trip: Trip): boolean {
    return !!trip.startDateTime && !trip.endDateTime;
  }
}
