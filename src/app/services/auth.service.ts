import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { email: 'admin1', password: '12345' },
    { email: 'admin2', password: 'pass' }
  ];

  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('token'); // Retorna verdadero si el token existe
    }
    return false; // Si no existe, retorna falso
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('token', 'usuario-autenticado'); // Simula un token
      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token al cerrar sesión
  }
}
