import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard, MonthlySummary } from '../../interfaces/transaction.interface';
import { Chart, registerables } from 'chart.js';
import { GraphicComponent } from '@app/components/graphic/graphic.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GraphicComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: Dashboard | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.loading = false;
      }
    });
  }

  formatCurrency(value: number | null | undefined): string {
    const numberValue = typeof value === 'number' ? value : 0;
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  }

  

  getMonthlySummaryDatasets() {
    if (!this.dashboardData) return [];

    return [
      {
        label: 'Receitas',
        data: this.dashboardData.monthlySummaries.map((m: MonthlySummary) => m.income),
        backgroundColor: '#4caf50'
      },
      {
        label: 'Despesas',
        data: this.dashboardData.monthlySummaries.map((m: MonthlySummary) => m.expense),
        backgroundColor: '#f44336'
      },
      {
        label: 'Saldo',
        data: this.dashboardData.monthlySummaries.map((m: MonthlySummary) => m.balance),
        backgroundColor: '#2196f3'
      }
    ];
  }

  getAccountBalanceLabels(): string[] {
    return this.dashboardData?.accountBalances
      ? Object.keys(this.dashboardData.accountBalances)
      : [];
  }

  getMonthlySummaryLabels(): string[] {
    return this.dashboardData?.monthlySummaries?.map((m: MonthlySummary) => m.month) ?? [];
  }

  getAccountBalanceDatasets() {
    if (!this.dashboardData?.accountBalances) return [];

    const data = Object.values(this.dashboardData.accountBalances);
    const backgroundColors = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0'];

    return [
      {
        data,
        backgroundColor: backgroundColors.slice(0, data.length)
      }
    ];
  }

  getMonthlyBalance(): number {
    if (!this.dashboardData?.monthlySummaries?.length) return 0;
    const last = this.dashboardData.monthlySummaries[this.dashboardData.monthlySummaries.length - 1];
    return last?.balance ?? 0;
  }
}
