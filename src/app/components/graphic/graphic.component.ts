import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ComunicacionService } from '../../services/comunicacion.service';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-graphic',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css']
})
export class GraphicComponent implements OnInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  min: number = 0;
  max: number = 0;
  avg: number = 0;

  public chartOptions: any = {
    series: [{
      name: 'Series 1',
      data: [22, 30, 40, 90, 50, 60, 80, 10, 1]
    }],
    chart: {
      type: 'bar'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [] // Se llenará dinámicamente con los valores min, avg, max
        }
      }
    }
  };

  constructor(private comunicacionService: ComunicacionService) {}

  ngOnInit(): void {
    this.comunicacionService.obtenerValoresEstadisticos().subscribe(valores => {
      if (valores) {
        this.min = valores.min;
        this.max = valores.max;
        this.avg = valores.avg;
  
        console.log(`Valores recibidos -> Min: ${this.min}, Avg: ${this.avg}, Max: ${this.max}`);
  
        // Asignar colores con la misma lógica que en la tabla
        this.chartOptions.plotOptions.bar.colors.ranges = [
          {
            from: 0,
            to: (this.avg + this.min) / 2,
            color: '#B04A4A' // Rojo para valores bajos
          },
          {
            from: (this.avg + this.min) / 2 + 1,
            to: (this.avg + this.max) / 2,
            color: '#26A0FC' // Amarillo para valores medios
          },
          {
            from: (this.avg + this.max) / 2 + 1,
            to: this.max,
            color: '#4CAF50' // Verde para valores altos
          }
        ];
      }
    });
  }
  
  actualizarRangosColores(): void {
    this.chartOptions.plotOptions.bar.colors.ranges = [
      { from: 0, to: this.min, color: '#B04A4A' }, // Rojo para valores bajos
      { from: this.min + 1, to: this.avg, color: '#C4B454' }, // Amarillo para valores medios
      { from: this.avg + 1, to: this.max, color: '#c6a9df' } // Verde para valores altos
    ];
  }

  captureChartImage(): void {
    if (typeof document !== 'undefined' && this.chartContainer) {
      html2canvas(this.chartContainer.nativeElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        Swal.fire({
          title: 'Vista Previa de la Gráfica',
          imageUrl: imgData,
          imageAlt: 'Gráfica Renderizada',
          showConfirmButton: true
        });
        this.comunicacionService.enviarImagenGrafica(imgData);
      }).catch((error) => {
        console.error('Error al capturar la imagen', error);
      });
    } else {
      console.error('No se puede acceder al contenedor de la gráfica o no estamos en el navegador');
    }
  }
}
