import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { DepreciationReport } from '../../models/reports/depreciation-report.model';

@Component({
  selector: 'app-depreciation-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './depreciation-report.component.html',
  styleUrls: ['./depreciation-report.component.scss']
})
export class DepreciationReportComponent implements OnInit {
  report: DepreciationReport | null = null;
  loading = false;
  error: string | null = null;
  
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
}
