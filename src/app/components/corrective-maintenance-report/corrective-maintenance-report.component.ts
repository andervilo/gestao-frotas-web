import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { CorrectiveMaintenanceReport } from '../../models/reports/corrective-maintenance-report.model';

@Component({
  selector: 'app-corrective-maintenance-report',
  templateUrl: './corrective-maintenance-report.component.html',
  styleUrls: ['./corrective-maintenance-report.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CorrectiveMaintenanceReportComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  report: CorrectiveMaintenanceReport | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // Definir data inicial como 30 dias atrás
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Por favor, selecione as datas.';
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.reportService.getCorrectiveMaintenanceReport(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.report = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao gerar relatório: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  exportToExcel(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    this.reportService.exportCorrectiveMaintenanceToExcel(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `relatorio-manutencao-corretiva-${new Date().toISOString().split('T')[0]}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Erro ao exportar para Excel:', err);
          this.error = 'Erro ao exportar para Excel';
        }
      });
  }

  exportToPDF(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    this.reportService.exportCorrectiveMaintenanceToPDF(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `relatorio-manutencao-corretiva-${new Date().toISOString().split('T')[0]}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Erro ao exportar para PDF:', err);
          this.error = 'Erro ao exportar para PDF';
        }
      });
  }

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SCHEDULED': 'Agendada',
      'PENDING': 'Pendente',
      'IN_PROGRESS': 'Em Progresso',
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada'
    };
    return statusMap[status] || status;
  }
}
