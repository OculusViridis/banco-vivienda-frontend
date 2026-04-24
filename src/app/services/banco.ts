import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private apiUrl = 'https://banco-vivienda-api.onrender.com/api';

  constructor(private http: HttpClient) { }

  // Función para obtener los saldos del cliente logueado
  getMisSaldos(): Observable<any> {
    // 1. Recuperamos el token del almacenamiento del navegador
    const token = localStorage.getItem('token');

    // 2. Lo agregamos al encabezado de Autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Hacemos la petición GET enviando esos encabezados
    return this.http.get(`${this.apiUrl}/cliente/mis-saldos`, { headers });
  }

  // Función para que el colaborador busque a un cliente por CUI
  buscarClientePorCui(cui: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/colaborador/buscar-cliente/${cui}`, { headers });
  }

  // Función para obtener el reporte de pagos por vencer
  getReportePagosPorVencer(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/colaborador/pagos-por-vencer`, { headers });
  }

  // Función para que el cliente solicite un nuevo producto
  solicitarProducto(datosSolicitud: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/cliente/solicitar-producto`, datosSolicitud, { headers });
  }

  // Función para registrar un pago a un préstamo
  registrarPago(datosPago: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/colaborador/registrar-pago`, datosPago, { headers });
  }

  // Función para obtener el historial de pagos de un préstamo específico
  getHistorialPagos(idPrestamo: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/cliente/mis-pagos/${idPrestamo}`, { headers });
  }

  // Función para que el colaborador ingrese una solicitud para un cliente
  crearSolicitudColaborador(datosSolicitud: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/colaborador/crear-solicitud`, datosSolicitud, { headers });
  }


}