import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';


@Component({
  selector: 'app-graphic',
  standalone: true,
  imports: [CommonModule],  // Importa NgChartsModule correctamente
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent {
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  public barChartLabels: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
  
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56], label: 'Ventas', backgroundColor: '#42A5F5' }
    ]
  };

  public barChartType: ChartType = 'bar'; // Asegurar que sea del tipo correcto
}
