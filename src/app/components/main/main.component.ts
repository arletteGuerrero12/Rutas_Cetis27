import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ComunicacionService } from '../../services/comunicacion.service';
import { AuthService } from '../../services/auth.service'; // ✅ Importar AuthService
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [FormsModule, CommonModule]
})
export class MainComponent implements OnInit {
  @ViewChild('sideMenu', { static: false }) sideMenu!: ElementRef;
  codigoP: string = '';
  rutas: any[] = []; // ✅ Almacenar rutas obtenidas desde la API
  rutaSeleccionada: string = ''; // ✅ Para manejar la selección del usuario
  codigoPo: string = '';
  codigosPostales: any[] = [];
  codigoPostalSeleccionado: string = '';

  constructor(
    private comunicacionService: ComunicacionService,
    private authService: AuthService // ✅ Inyectar AuthService para obtener rutas
  ) {}

  ngOnInit() {
    // ✅ Obtener rutas desde la API al iniciar el componente
    this.authService.getRuta().subscribe((data) => {
      this.rutas = data;
    });
  }

  enviarCodigo() {
    this.comunicacionService.cambiarMensaje(this.codigoP);
    this.comunicacionService.cambiarMensaje(this.rutaSeleccionada);
  }

  toggleMenu() {
    if (this.sideMenu) {
      const menu = this.sideMenu.nativeElement;
      menu.classList.toggle('open');
    }
  }

  // ✅ Método que se ejecuta cuando cambia la selección de ruta en el combobox
  onRutaSeleccionada(event: any) {
    this.rutaSeleccionada = event.target.value;
    console.log("Ruta seleccionada:", this.rutaSeleccionada);
  }

   onCodigoPostalSeleccionado(event: any) {
    this.codigoPostalSeleccionado = event.target.value;
    console.log("Código postal seleccionado:", this.codigoPostalSeleccionado);
  }
}