import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

 

  onLogin() {
    this.authService.login(this.usuario, this.contrasena).subscribe(response => {
      console.log("Respuesta de PHP:", response); // Ver en la consola
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']); // Redirige a la página principal
      } else {
        this.errorMessage = 'Credenciales incorrectas  Verificar usuario o contraseña';

           
        // Limpiar los campos de usuario y contraseña
        this.usuario = '';
        this.contrasena = '';

      }
    });
  }
  onEstudiantes(): void {
  this.router.navigate(['/student']);
  }
}