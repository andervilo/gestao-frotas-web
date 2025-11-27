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
}
