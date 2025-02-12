import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  private mensajeSource = new BehaviorSubject<string>('Mensaje inicial');
  mensajeActual = this.mensajeSource.asObservable();

  cambiarMensaje(nuevoMensaje: string) {
    this.mensajeSource.next(nuevoMensaje);
  }

  obtenerMensaje() {
    return this.mensajeActual;
  }
}
