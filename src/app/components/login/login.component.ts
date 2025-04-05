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
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const isAuthenticated = this.authService.login(this.email, this.password);

    if (isAuthenticated) {
      this.router.navigate(['/home']); // Redirige a /home tras autenticación
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos'; // Muestra el error
    }
  }
}
