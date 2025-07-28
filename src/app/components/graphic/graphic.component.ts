import { Component, Input, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  standalone: true,
  imports: [],
})
export class GraphicComponent implements OnInit, OnDestroy {
  @Input() chartId: string = 'chart';
  @Input() type: ChartConfiguration['type'] = 'bar';
  @Input() labels: string[] = [];
  @Input() datasets: ChartConfiguration['data']['datasets'] = [];

  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chartInstance: Chart | null = null;

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private renderChart(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                });
              }
            }
          }
        }
      }
    });
  }

  private destroyChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }
}
