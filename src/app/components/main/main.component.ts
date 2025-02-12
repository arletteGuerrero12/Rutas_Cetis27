import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ComunicacionService } from '../../services/comunicacion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [FormsModule, CommonModule] // Aquí agregamos CommonModule
})
export class MainComponent implements OnInit {
  @ViewChild('sideMenu', { static: false }) sideMenu!: ElementRef;
  municipios: { nombre: string, cveEnt: string }[] = [];
  municipiosFiltrados: { nombre: string, cveEnt: string }[] = [];
  estadoSeleccionado: string = '';
  municipioSeleccionado: string = ''; // Añadimos esta propiedad
  codigoP: string = '';

  constructor(private comunicacionService: ComunicacionService, private http: HttpClient) {}

  ngOnInit() {
    this.cargarMunicipios();
  }

  cargarMunicipios() {
    this.http.get<any>('assets/imagine/municipios.json').subscribe(data => {
      this.municipios = data.features
        .map((feature: any) => ({
          nombre: feature.properties.NOM_MUN,
          cveEnt: feature.properties.CVE_ENT
        }))
        .sort((a: { nombre: string; cveEnt: string }, b: { nombre: string; cveEnt: string }) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente por nombre
    });
  }
  
    

  filtrarMunicipiosPorEstado() {
    if (this.estadoSeleccionado === 'Michoacán') {
      this.municipiosFiltrados = this.municipios.filter(municipio => municipio.cveEnt === '16');
      console.log(this.estadoSeleccionado)
    } else if (this.estadoSeleccionado === 'Jalisco') {
      this.municipiosFiltrados = this.municipios.filter(municipio => municipio.cveEnt === '14');
    } else {
      this.municipiosFiltrados = [];
    }
  }

  enviarMensaje() {
    this.filtrarMunicipiosPorEstado();
    if (this.estadoSeleccionado && this.estadoSeleccionado !== "#") {
      this.comunicacionService.cambiarMensaje(this.estadoSeleccionado);
    } else {
      console.warn("No se ha seleccionado un estado válido");
    }
  }

  enviarCodigo() {
    this.comunicacionService.cambiarMensaje(this.codigoP);
  }

  toggleMenu() {
    if (this.sideMenu) {
      const menu = this.sideMenu.nativeElement;
      menu.classList.toggle('open');
    }
  }
}
