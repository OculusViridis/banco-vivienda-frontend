import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para los inputs
import { Router } from '@angular/router'; // Para redirigir al usuario
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  
  credenciales = {
    username: '',
    password: ''
  };

  mensajeError: string = '';

  // Inyectamos el servicio de Autenticación y el Enrutador
  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.mensajeError = ''; // Limpiamos errores anteriores

    this.authService.login(this.credenciales).subscribe({
      next: (respuesta) => {
        // El login fue exitoso, el token ya se guardó en el servicio
        const rol = this.authService.getRol();
        
        // Redirigir según el rol
        if (rol === 1) {
          this.router.navigate(['/cliente']);
        } else if (rol === 2) {
          this.router.navigate(['/colaborador']);
        } else {
          this.mensajeError = 'Rol no reconocido.';
        }
      },
      error: (error) => {
        // El backend devolvió un error (ej. contraseña incorrecta)
        console.error(error);
        this.mensajeError = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}