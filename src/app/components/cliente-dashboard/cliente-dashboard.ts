import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BancoService } from '../../services/banco';
import { AuthService } from '../../services/auth';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // Necesario para usar *ngIf y *ngFor en el HTML
  templateUrl: './cliente-dashboard.html',
  styleUrl: './cliente-dashboard.css'
})
export class ClienteDashboard implements OnInit {
  datosBancarios: any = null;
  mensajeError: string = '';

  nuevaSolicitud = {
    tipo_producto: '',
    detalle: ''
  };
  // Variables para el historial de pagos
  prestamoViendoPagos: number | null = null;
  historialPagos: any[] = [];
  cargandoPagos: boolean = false;

  mensajeSolicitud: string = '';
  enviandoSolicitud: boolean = false;

  constructor(
    private bancoService: BancoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // ngOnInit se ejecuta automáticamente al abrir esta pantalla
  ngOnInit(): void {
    this.cargarSaldos();
  }

  cargarSaldos() {
    this.bancoService.getMisSaldos().subscribe({
      next: (datos) => {
        // Guardamos el JSON que nos manda Node.js en nuestra variable
        this.datosBancarios = datos;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'Tu sesión ha expirado o hubo un error de conexión.';
        // Si hay error (ej. token falso), lo regresamos al login por seguridad
        this.cerrarSesion();
      }
    });
  }

  enviarSolicitud() {
    this.enviandoSolicitud = true;
    this.mensajeSolicitud = '';

    this.bancoService.solicitarProducto(this.nuevaSolicitud).subscribe({
      next: (res) => {
        this.mensajeSolicitud = res.mensaje;
        this.enviandoSolicitud = false;
        // Limpiamos el formulario
        this.nuevaSolicitud = { tipo_producto: '', detalle: '' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensajeSolicitud = 'Ocurrió un error al enviar la solicitud.';
        this.enviandoSolicitud = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Función para mostrar u ocultar los pagos
  verHistorialPagos(idPrestamo: number) {
    // Si el usuario vuelve a hacer clic en el mismo botón, se cierra (Efecto Toggle)
    if (this.prestamoViendoPagos === idPrestamo) {
      this.prestamoViendoPagos = null;
      return;
    }

    this.prestamoViendoPagos = idPrestamo;
    this.cargandoPagos = true;
    this.historialPagos = [];

    this.bancoService.getHistorialPagos(idPrestamo).subscribe({
      next: (pagos) => {
        this.historialPagos = pagos;
        this.cargandoPagos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pagos:', err);
        this.cargandoPagos = false;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}