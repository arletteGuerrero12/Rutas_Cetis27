import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Permitir el acceso si el usuario está autenticado
  }

  router.navigate(['/login']); // Redirigir al login si no está autenticado
  return false; // Bloquear el acceso
};


