import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { ComunicacionService } from '../../services/comunicacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef; // Referencia a la tabla
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef; // Referencia a la gráfica

  // Definición de los encabezados de la tabla
  headers = ['Number', 'First', 'Last'];

  datosTabla: any[] = [
    { number: 1, first: '22', last: '@TABLA', color: '' },
    { number: 2, first: '30', last: '@UNI', color: '' },
    { number: 3, first: '40', last: '@DOS', color: '' },
    { number: 4, first: '90', last: '@SUCCESS', color: '' },
    { number: 5, first: '50', last: '@DANGER', color: '' },
    { number: 6, first: '60', last: '@WARNING', color: '' },
    { number: 7, first: '80', last: '@INFO', color: '' },
    { number: 8, first: '10', last: '@LIGHT', color: '' },
    { number: 9, first: '1', last: '@DARK', color: '' }
  ];

  // Variables para valores mínimo, máximo y promedio de 'first'
  min: number = 0;
  max: number = 0;
  avg: number = 0;

  // Para la imagen de la gráfica
  imagenGrafica: string | null = null;

  constructor(private comunicacionService: ComunicacionService) {
    this.assignColors();
  }

  ngOnInit(): void {
    this.comunicacionService.obtenerImagenGrafica().subscribe(imagen => {
      this.imagenGrafica = imagen;
    });

    // Suscribirse a los datos del servicio de comunicación
    this.comunicacionService.obtenerGrafica().subscribe(datos => {
      if (datos) {
        this.datosTabla = datos.series[0].data.map((value: number, index: number) => ({
          number: index + 1,
          first: value.toString(),
          last: datos.xaxis.categories[index],
          color: ''
        }));
        this.assignColors();
      }
    });
  }

  // Función para generar un archivo PDF con la tabla y la gráfica
  generarPDF(): void {
    const doc = new jsPDF();
    
    // Función para agregar el encabezado en cada página
    const agregarEncabezado = () => {
      // Agregar franja azul en el encabezado
      doc.setFillColor(12, 35, 30); // Azul oscuro
      doc.rect(0, 0, 210, 30, 'F'); // Rectángulo de ancho total
  
      // Agregar el logo de la empresa (ajusta la ruta según tu estructura)
      const logo = new Image();
      logo.src = 'assets/imagine/dgtiSF.png';
      doc.addImage(logo, 'PNG', 10, 1, 28, 28); // Ajustado tamaño y posición
  
      // Agregar el nombre de la empresa
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(23);
      doc.setFont('helvetica', 'bold');
      doc.text('Cetis 27', 38, 18);
  
      // Agregar la fecha de generación en la parte superior derecha
      const fechaActual = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Fecha: ${fechaActual}`, 160, 15);
    };
  
    // Agregar el encabezado en la primera página
    agregarEncabezado();
  
    // Espaciado después del encabezado
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Tabla Exportada a PDF', 14, 40);
  
    // Datos de la tabla
    const tablaData = this.datosTabla.map(d => [d.number, d.first, d.last]);
  
    autoTable(doc, {
      startY: 45, // Posición debajo del encabezado
      head: [this.headers],
      body: tablaData,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 51, 102], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { fillColor: [240, 240, 240] }, // Fila gris clara
      didParseCell: (data) => {
        if (data.section === 'body') {
          const rowIndex = data.row.index;
          const valorActual = Number(this.datosTabla[rowIndex]?.first);
          let fillColor: [number, number, number] = [207, 226, 255];
  
          if (valorActual <= (this.avg + this.min) / 2) {
            fillColor = [248, 215, 218]; // Rojo claro
          } else if (valorActual >= (this.avg + this.max) / 2) {
            fillColor = [209, 231, 221]; // Verde claro
          } else {
            fillColor = [178, 204, 247]; // Azul claro
          }
          data.cell.styles.fillColor = fillColor;
        }
      },
      didDrawPage: () => {
        agregarEncabezado(); // Agregar el encabezado en cada página nueva
      }
    });
  
    // Agregar imagen de la gráfica si existe
    if (this.imagenGrafica) {
      doc.addPage();
      agregarEncabezado(); // Agregar encabezado en la página de la gráfica
      doc.text('Gráfica Generada', 14, 40);
      doc.addImage(this.imagenGrafica, 'PNG', 10, 50, 180, 120);
    } else {
      Swal.fire('Error', 'No se ha podido obtener la imagen de la gráfica', 'error');
    }
  
    // Guardar el PDF
    doc.save('GeoInnmortal_Report.pdf');
  }
  
  
  
  assignColors(): void {
    const firstValues = this.datosTabla.map(d => parseInt(d.first, 10));
    this.min = Math.min(...firstValues);
    this.max = Math.max(...firstValues);
    this.avg = firstValues.reduce((a, b) => a + b, 0) / firstValues.length;

 // Enviar los valores al servicio
 this.comunicacionService.enviarValoresEstadisticos(this.min, this.max, this.avg);

    this.datosTabla.forEach(d => {
      const value = parseInt(d.first, 10);
      if (value <= (this.avg + this.min) / 2) {
        d.color = 'table-danger';
      } else if (value >= (this.avg + this.max) / 2) {
        d.color = 'table-success';
      } else {
        d.color = 'table-primary';
      }
    });
  }
}
