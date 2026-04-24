import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La URL de tu servidor Node.js
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  // 1. Función para hacer el Login
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((respuesta: any) => {
        // Si el login es exitoso, guardamos el Token y el Rol en el navegador
        if (respuesta.token) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('id_rol', respuesta.id_rol.toString());
        }
      })
    );
  }

  // 2. Función para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id_rol');
  }

  // 3. Verifica si el usuario tiene un token guardado
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  // 4. Obtiene el rol del usuario logueado (1=Cliente, 2=Colaborador)
  getRol(): number {
    const rol = localStorage.getItem('id_rol');
    return rol ? parseInt(rol, 10) : 0;
  }
}