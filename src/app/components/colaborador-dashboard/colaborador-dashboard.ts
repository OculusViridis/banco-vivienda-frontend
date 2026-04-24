import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el input de búsqueda
import { Router } from '@angular/router';
import { BancoService } from '../../services/banco';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-colaborador-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './colaborador-dashboard.html',
  styleUrl: './colaborador-dashboard.css'
})
export class ColaboradorDashboard {
  cuiBusqueda: string = '';
  datosCliente: any = null;
  mensajeError: string = '';
  cargando: boolean = false;
  reportePagos: any[] | null = null;
  cargandoReporte: boolean = false;

  constructor(
    private bancoService: BancoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  buscarCliente() {
    if (!this.cuiBusqueda) return;

    this.cargando = true;
    this.mensajeError = '';
    this.datosCliente = null;

    this.bancoService.buscarClientePorCui(this.cuiBusqueda).subscribe({
      next: (datos) => {
        this.datosCliente = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 404) {
          this.mensajeError = 'No se encontró ningún cliente con ese CUI.';
        } else {
          this.mensajeError = 'No tienes permisos o la sesión expiró.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  cargarReporteMorosidad() {
    this.cargandoReporte = true;
    this.reportePagos = null;

    this.bancoService.getReportePagosPorVencer().subscribe({
      next: (datos) => {
        this.reportePagos = datos;
        this.cargandoReporte = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Error al cargar el reporte.';
        this.cargandoReporte = false;
        this.cdr.detectChanges();
      }
    });
  }


  // Variables para el formulario de pagos
  prestamoSeleccionado: any = null;
  nuevoPago = {
    id_prestamo: null,
    monto_pagado: null,
    metodo_pago: 'Efectivo'
  };
  mensajePago: string = '';
  procesandoPago: boolean = false;

  // 1. Función para abrir el formulario al lado del préstamo
  prepararPago(prestamo: any) {
    this.prestamoSeleccionado = prestamo;
    this.nuevoPago.id_prestamo = prestamo.id_prestamo;
    this.nuevoPago.monto_pagado = null; // Limpiamos el monto anterior
    this.mensajePago = '';
  }

  // 2. Función que envía el dinero al backend
  procesarPago() {
    this.procesandoPago = true;
    this.mensajePago = '';

    this.bancoService.registrarPago(this.nuevoPago).subscribe({
      next: (res) => {
        this.mensajePago = res.mensaje;
        this.procesandoPago = false;
        
        // Refrescamos los datos del cliente para ver el nuevo saldo de inmediato
        this.buscarCliente(); 
        
        // Ocultamos el formulario después de 3 segundos
        setTimeout(() => {
          this.prestamoSeleccionado = null;
          this.cdr.detectChanges();
        }, 3000);
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensajePago = 'Error al procesar el pago.';
        this.procesandoPago = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ... (tus variables y funciones anteriores se quedan igual) ...

  // Variables para la nueva solicitud del colaborador
  nuevaSolicitud = {
    tipo_producto: '',
    detalle: ''
  };
  mensajeSolicitud: string = '';
  enviandoSolicitud: boolean = false;

  // Función para enviar la solicitud
  enviarSolicitud() {
    this.enviandoSolicitud = true;
    this.mensajeSolicitud = '';

    // Armamos el paquete de datos agregando el CUI del cliente que tenemos en pantalla
    const payload = {
      cui: this.datosCliente.datos_personales.cui,
      tipo_producto: this.nuevaSolicitud.tipo_producto,
      detalle: this.nuevaSolicitud.detalle
    };

    this.bancoService.crearSolicitudColaborador(payload).subscribe({
      next: (res) => {
        this.mensajeSolicitud = res.mensaje;
        this.enviandoSolicitud = false;
        // Limpiamos el formulario
        this.nuevaSolicitud = { tipo_producto: '', detalle: '' };
        this.cdr.detectChanges();
        
        // Desaparecemos el mensaje de éxito después de 4 segundos
        setTimeout(() => {
          this.mensajeSolicitud = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.mensajeSolicitud = 'Error al registrar la solicitud.';
        this.enviandoSolicitud = false;
        this.cdr.detectChanges();
      }
    });
  }
  
}