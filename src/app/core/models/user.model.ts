export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  dni: string;
  celular: string;
  email: string;
  password: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  rol: string;
  creado: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}