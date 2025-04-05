import { Injectable } from '@angular/core';
import { BehaviorSubject ,Subject,Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  // Para mensajes simples
  private mensajeSource = new BehaviorSubject<string>('Mensaje inicial');
  mensajeActual = this.mensajeSource.asObservable();

  // Para datos de la gráfica
  private graficaSource = new BehaviorSubject<any>(null);
  graficaActual = this.graficaSource.asObservable();

  private imagenGraficaSubject = new Subject<string>(); // Para la imagen de la gráfica
  private valoresEstadisticosSubject = new BehaviorSubject<{ min: number, max: number, avg: number } | null>(null);


  // Función para cambiar el mensaje
  cambiarMensaje(nuevoMensaje: string) {
    this.mensajeSource.next(nuevoMensaje);
  }

  // Función para obtener el mensaje actual
  obtenerMensaje() {
    return this.mensajeActual;
  }

  // Función para enviar datos de la gráfica
  enviarGrafica(datosGrafica: any) {
    this.graficaSource.next(datosGrafica);
  }

  // Función para obtener los datos de la gráfica
  obtenerGrafica() {
    return this.graficaActual;
  }

  enviarImagenGrafica(imagen: string) {
    this.imagenGraficaSubject.next(imagen);
  }

  obtenerImagenGrafica() {
    return this.imagenGraficaSubject.asObservable();
  }

  enviarValoresEstadisticos(min: number, max: number, avg: number): void {
    this.valoresEstadisticosSubject.next({ min, max, avg });
  }

  obtenerValoresEstadisticos(): Observable<{ min: number, max: number, avg: number } | null> {
    return this.valoresEstadisticosSubject.asObservable();
  }
}
