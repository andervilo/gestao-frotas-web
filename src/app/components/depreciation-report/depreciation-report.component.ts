import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { DepreciationReport } from '../../models/reports/depreciation-report.model';

@Component({
  selector: 'app-depreciation-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './depreciation-report.component.html',
  styleUrls: ['./depreciation-report.component.scss']
})
export class DepreciationReportComponent implements OnInit {
  report: DepreciationReport | null = null;
  loading = false;
  error: string | null = null;

  // Pagination for vehicle depreciation
  currentPage = 1;
  itemsPerPage = 5;
  pageSizeOptions = [5, 10, 25, 50, 100];
  
  constructor(private reportService: ReportService) {}
  
  ngOnInit(): void {
    this.generateReport();
  }
  
  generateReport(): void {
    this.loading = true;
    this.error = null;
    this.reportService.getDepreciationReport().subscribe({
      next: (data) => {
        console.log('Depreciation Report data received:', data);
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de depreciação';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  exportToExcel(): void {
    this.reportService.downloadDepreciationReportExcel();
  }
  
  exportToPDF(): void {
    this.reportService.downloadDepreciationReportPDF();
  }

  // Pagination methods
  get paginatedVehicles() {
    if (!this.report?.vehicleDepreciation) return [];
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.report.vehicleDepreciation.slice(start, end);
  }

  get totalPages(): number {
    if (!this.report?.vehicleDepreciation) return 0;
    return Math.ceil(this.report.vehicleDepreciation.length / this.itemsPerPage);
  }

  get totalItems(): number {
    return this.report?.vehicleDepreciation?.length || 0;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
    this.currentPage = 1;
  }
}
