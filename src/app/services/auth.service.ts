import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/api/db.php';
  private http = inject(HttpClient); // Nueva forma de inyección

  login(usuario: string, contrasena: string): Observable<any> {
    const body = { Usuario: usuario, Contrasena: contrasena };
    return this.http.post<any>(this.apiUrl, body);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false; // o maneja el caso de renderización en servidor
    }
  
    const token = localStorage.getItem('token');
    return !!token;
  }

    // 📌 **Nuevo método para obtener rutas desde la API**
    getRuta(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}?accion=ruta`);
    }

     getCP(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}?accion=cp`);
    }
  
  
}