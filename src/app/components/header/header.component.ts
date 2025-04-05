import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar el servicio de autenticación
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // Llama al servicio para cerrar sesión
    this.router.navigate(['/login']); // Redirige al login
  }
}
