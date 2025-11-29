import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { MaintenanceReport, MaintenanceHistory, UpcomingMaintenance, OverdueMaintenance } from '../../models/reports/maintenance-report.model';

@Component({
  selector: 'app-maintenance-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.scss']
})
export class MaintenanceReportComponent implements OnInit {
  report: MaintenanceReport | null = null;
  loading = false;
  error: string | null = null;
  activeTab: string = 'overdue';
  
  startDate: string = '';
  endDate: string = '';

  // Pagination for overdue
  currentPageOverdue = 1;
  itemsPerPageOverdue = 5;
  pageSizeOptionsOverdue = [5, 10, 25, 50, 100];

  // Pagination for upcoming
  currentPageUpcoming = 1;
  itemsPerPageUpcoming = 5;
  pageSizeOptionsUpcoming = [5, 10, 25, 50, 100];

  // Pagination for history
  currentPageHistory = 1;
  itemsPerPageHistory = 5;
  pageSizeOptionsHistory = [5, 10, 25, 50, 100];
  
  constructor(private reportService: ReportService) {}
  
  ngOnInit(): void {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(thirtyDaysAgo);
    
    this.generateReport();
  }
  
  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Por favor, selecione as datas de início e fim';
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.reportService.getMaintenanceReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Maintenance Report data received:', data);
        this.report = data;
        this.loading = false;
        // Define a primeira aba disponível como ativa
        if (data.overdue && data.overdue.length > 0) {
          this.activeTab = 'overdue';
        } else if (data.upcoming && data.upcoming.length > 0) {
          this.activeTab = 'upcoming';
        } else {
          this.activeTab = 'history';
        }
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de manutenção';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  exportToExcel(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadMaintenanceReportExcel(this.startDate, this.endDate);
  }
  
  exportToPDF(): void {
    if (!this.startDate || !this.endDate) return;
    this.reportService.downloadMaintenanceReportPDF(this.startDate, this.endDate);
  }

  // Excel Export Methods for Tabs
  exportOverdueExcel(): void {
    if (!this.report?.overdue || this.report.overdue.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    const data = this.report.overdue.map(item => ({
      'Placa': item.licensePlate,
      'Marca': item.brand,
      'Modelo': item.model,
      'Tipo': item.type,
      'Data Agendada': item.scheduledDate,
      'Dias em Atraso': item.daysOverdue,
      'Severidade': item.severity
    }));

    this.exportTabToExcel(data, 'Manutencoes_Atrasadas');
  }

  exportUpcomingExcel(): void {
    if (!this.report?.upcoming || this.report.upcoming.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    const data = this.report.upcoming.map(item => ({
      'Placa': item.licensePlate,
      'Marca': item.brand,
      'Modelo': item.model,
      'Tipo': item.type,
      'Data Agendada': item.scheduledDate,
      'Dias até Vencimento': item.daysUntil,
      'Prioridade': item.priority
    }));

    this.exportTabToExcel(data, 'Manutencoes_Proximas');
  }

  exportHistoryExcel(): void {
    if (!this.report?.history || this.report.history.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    const data = this.report.history.map(item => ({
      'Placa': item.licensePlate,
      'Tipo': item.type,
      'Descrição': item.description,
      'Data Agendada': item.scheduledDate,
      'Data Conclusão': item.completionDate || 'N/A',
      'Custo': item.cost,
      'Status': this.translateStatus(item.status)
    }));

    this.exportTabToExcel(data, 'Historico_Manutencoes');
  }

  private exportTabToExcel(data: any[], filename: string): void {
    const worksheet = this.createWorksheet(data);
    const workbook = this.writeWorkbook(worksheet);
    this.saveAsExcelFile(workbook, filename);
  }

  private createWorksheet(data: any[]): string {
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
      csv += headers.map(header => row[header]).join(',') + '\n';
    });
    return csv;
  }

  private writeWorkbook(worksheet: string): Blob {
    return new Blob([worksheet], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private saveAsExcelFile(workbook: Blob, filename: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(workbook);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().getTime()}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'ALTA': return 'priority-high';
      case 'MEDIA': return 'priority-medium';
      case 'BAIXA': return 'priority-low';
      default: return '';
    }
  }
  
  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICA': return 'severity-critical';
      case 'ALTA': return 'severity-high';
      case 'MEDIA': return 'severity-medium';
      default: return '';
    }
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'COMPLETED': 'Concluído',
      'PENDING': 'Pendente',
      'SCHEDULED': 'Agendado',
      'IN_PROGRESS': 'Em Andamento',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING': return 'status-pending';
      case 'SCHEDULED': return 'status-scheduled';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  // Pagination methods for overdue maintenances
  get paginatedOverdue() {
    if (!this.report?.overdue) return [];
    const start = (this.currentPageOverdue - 1) * this.itemsPerPageOverdue;
    const end = start + this.itemsPerPageOverdue;
    return this.report.overdue.slice(start, end);
  }

  get totalPagesOverdue(): number {
    if (!this.report?.overdue) return 0;
    return Math.ceil(this.report.overdue.length / this.itemsPerPageOverdue);
  }

  get totalItemsOverdue(): number {
    return this.report?.overdue?.length || 0;
  }

  get pagesOverdue(): number[] {
    return Array.from({ length: this.totalPagesOverdue }, (_, i) => i + 1);
  }

  changePageOverdue(page: number): void {
    if (page >= 1 && page <= this.totalPagesOverdue) {
      this.currentPageOverdue = page;
    }
  }

  onPageSizeChangeOverdue(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageOverdue = parseInt(target.value, 10);
    this.currentPageOverdue = 1;
  }

  // Pagination methods for upcoming maintenances
  get paginatedUpcoming() {
    if (!this.report?.upcoming) return [];
    const start = (this.currentPageUpcoming - 1) * this.itemsPerPageUpcoming;
    const end = start + this.itemsPerPageUpcoming;
    return this.report.upcoming.slice(start, end);
  }

  get totalPagesUpcoming(): number {
    if (!this.report?.upcoming) return 0;
    return Math.ceil(this.report.upcoming.length / this.itemsPerPageUpcoming);
  }

  get totalItemsUpcoming(): number {
    return this.report?.upcoming?.length || 0;
  }

  get pagesUpcoming(): number[] {
    return Array.from({ length: this.totalPagesUpcoming }, (_, i) => i + 1);
  }

  changePageUpcoming(page: number): void {
    if (page >= 1 && page <= this.totalPagesUpcoming) {
      this.currentPageUpcoming = page;
    }
  }

  onPageSizeChangeUpcoming(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageUpcoming = parseInt(target.value, 10);
    this.currentPageUpcoming = 1;
  }

  // Pagination methods for history
  get paginatedHistory() {
    if (!this.report?.history) return [];
    const start = (this.currentPageHistory - 1) * this.itemsPerPageHistory;
    const end = start + this.itemsPerPageHistory;
    return this.report.history.slice(start, end);
  }

  get totalPagesHistory(): number {
    if (!this.report?.history) return 0;
    return Math.ceil(this.report.history.length / this.itemsPerPageHistory);
  }

  get totalItemsHistory(): number {
    return this.report?.history?.length || 0;
  }

  get pagesHistory(): number[] {
    return Array.from({ length: this.totalPagesHistory }, (_, i) => i + 1);
  }

  changePageHistory(page: number): void {
    if (page >= 1 && page <= this.totalPagesHistory) {
      this.currentPageHistory = page;
    }
  }

  onPageSizeChangeHistory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageHistory = parseInt(target.value, 10);
    this.currentPageHistory = 1;
  }
}
