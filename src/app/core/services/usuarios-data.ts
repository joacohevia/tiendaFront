import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '../models/user.model';
import { API_BASE_URL } from './api';

@Injectable({
  providedIn: 'root',
})
export class UsuariosDataService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          this.usuarioSubject.next(response.usuario);
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/registro`, data);
  }

  isLoggedIn(): boolean {
    return this.usuarioSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.usuarioSubject.value?.rol === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuarioId(): number | null {
    const user = this.usuarioSubject.value;
    return user ? user.id_usuario : null;
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): Observable<any> {
    const id = this.getUsuarioId();
    return this.http.put(`${API_BASE_URL}/usuarios/${id}/cambiar-password`, {
      passwordActual,
      passwordNueva,
    });
  }

  private getStoredUser(): Usuario | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }
}
