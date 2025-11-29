import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../services/report.service';
import { CostReport } from '../../../models/reports/cost-report.model';

@Component({
  selector: 'app-cost-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cost-report.component.html',
  styleUrl: './cost-report.component.scss'
})
export class CostReportComponent implements OnInit {
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];
  
  report: CostReport | null = null;
  loading = false;
  error: string | null = null;

  // Tabs
  activeTab: 'vehicles' | 'monthly' = 'vehicles';

  // Pagination for vehicle costs
  currentPageVehicles = 1;
  itemsPerPageVehicles = 5;
  pageSizeOptionsVehicles = [5, 10, 25, 50, 100];

  // Pagination for monthly costs
  currentPageMonthly = 1;
  itemsPerPageMonthly = 5;
  pageSizeOptionsMonthly = [5, 10, 25, 50, 100];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.error = null;

    this.reportService.getCostReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar relatório de custos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  exportExcel(): void {
    this.reportService.downloadCostReportExcel(this.startDate, this.endDate);
  }

  exportPDF(): void {
    this.reportService.downloadCostReportPDF(this.startDate, this.endDate);
  }

  // Pagination methods for vehicle costs
  get paginatedVehicles() {
    if (!this.report?.vehicleCosts) return [];
    const start = (this.currentPageVehicles - 1) * this.itemsPerPageVehicles;
    const end = start + this.itemsPerPageVehicles;
    return this.report.vehicleCosts.slice(start, end);
  }

  get totalPagesVehicles(): number {
    if (!this.report?.vehicleCosts) return 0;
    return Math.ceil(this.report.vehicleCosts.length / this.itemsPerPageVehicles);
  }

  get totalItemsVehicles(): number {
    return this.report?.vehicleCosts?.length || 0;
  }

  get pagesVehicles(): number[] {
    return Array.from({ length: this.totalPagesVehicles }, (_, i) => i + 1);
  }

  changePageVehicles(page: number): void {
    if (page >= 1 && page <= this.totalPagesVehicles) {
      this.currentPageVehicles = page;
    }
  }

  onPageSizeChangeVehicles(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageVehicles = parseInt(target.value, 10);
    this.currentPageVehicles = 1;
  }

  // Pagination methods for monthly costs
  get paginatedMonthly() {
    if (!this.report?.monthlyCosts) return [];
    const start = (this.currentPageMonthly - 1) * this.itemsPerPageMonthly;
    const end = start + this.itemsPerPageMonthly;
    return this.report.monthlyCosts.slice(start, end);
  }

  get totalPagesMonthly(): number {
    if (!this.report?.monthlyCosts) return 0;
    return Math.ceil(this.report.monthlyCosts.length / this.itemsPerPageMonthly);
  }

  get totalItemsMonthly(): number {
    return this.report?.monthlyCosts?.length || 0;
  }

  get pagesMonthly(): number[] {
    return Array.from({ length: this.totalPagesMonthly }, (_, i) => i + 1);
  }

  changePageMonthly(page: number): void {
    if (page >= 1 && page <= this.totalPagesMonthly) {
      this.currentPageMonthly = page;
    }
  }

  onPageSizeChangeMonthly(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageMonthly = parseInt(target.value, 10);
    this.currentPageMonthly = 1;
  }
}
