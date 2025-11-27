import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { FleetUtilizationReport } from '../../../models/reports/fleet-utilization-report.model';

@Component({
  selector: 'app-fleet-utilization-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-utilization-report.component.html',
  styleUrl: './fleet-utilization-report.component.scss'
})
export class FleetUtilizationReportComponent implements OnInit {
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];
  
  report: FleetUtilizationReport | null = null;
  loading = false;
  error: string | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.error = null;

    this.reportService.getFleetUtilizationReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de utilização';
        this.loading = false;
        console.error(err);
      }
    });
  }

  exportExcel(): void {
    this.reportService.downloadFleetUtilizationExcel(this.startDate, this.endDate);
  }

  exportPDF(): void {
    this.reportService.downloadFleetUtilizationPDF(this.startDate, this.endDate);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'ALTO': return 'status-high';
      case 'MEDIO': return 'status-medium';
      case 'BAIXO': return 'status-low';
      default: return '';
    }
  }
}
