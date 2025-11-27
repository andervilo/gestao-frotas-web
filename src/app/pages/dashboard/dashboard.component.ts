import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = false;
  error: string | null = null;
  activeTab: 'vehicles' | 'drivers' | 'trips' | 'maintenances' = 'vehicles';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  setActiveTab(tab: 'vehicles' | 'drivers' | 'trips' | 'maintenances'): void {
    this.activeTab = tab;
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar estatísticas do dashboard';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
