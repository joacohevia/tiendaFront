import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api';

export interface PedidoResumen {
  id_pedido: number;
  id_usuario: number;
  fecha: string;
  estado: string;
  total: number;
}

export interface PedidoProducto {
  id_pedido_producto: number;
  id_variante: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto: {
    nombre: string;
    talle: string;
    color: string;
  };
}
export interface PedidoDetalleExtras {
  id_pedido_producto: number;
  id_variante: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: string;
  producto_nombre: string;
  talle: string;
  color: string;
}

export interface PedidoDetalle {
  pedido: PedidoResumen;
  productos: PedidoProducto[];
}

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private http: HttpClient) {}

  getPedidosByUsuario(idUsuario: number): Observable<PedidoResumen[]> {
    return this.http.get<PedidoResumen[]>(`${API_BASE_URL}/pedidos/usuario/${idUsuario}`);
  }

  getPedidoDetalle(idPedido: number): Observable<{ productos: PedidoDetalleExtras[] }> {
    return this.http.get<{ productos: PedidoDetalleExtras[] }>(`${API_BASE_URL}/pedidos/${idPedido}`);
  }

  crearPedido(idUsuario: number): Observable<{ id_pedido: number }> {
    return this.http.post<{ id_pedido: number }>(`${API_BASE_URL}/pedidos`, {
      id_usuario: idUsuario,
      estado: 'pendiente',
    });
  }

  agregarProducto(
    idPedido: number,
    idVariante: number,
    cantidad: number,
    precioUnitario: number
  ): Observable<any> {//lo que la api espera 
    console.log(idPedido,idVariante,cantidad,precioUnitario)
    return this.http.post(`${API_BASE_URL}/pedidos/${idPedido}/productos`, {
      id_variante: idVariante,
      cantidad: cantidad,
      precio_unitario: precioUnitario,
    });
  }

  deletePedido(idPedido: number): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/pedidos/${idPedido}`);
  }

  deleteProductoPedido(idPedidoProducto: number): Observable<{ mensaje: string; nuevo_total: number }> {
    return this.http.delete<{ mensaje: string; nuevo_total: number }>(`${API_BASE_URL}/pedidos/producto/${idPedidoProducto}`);
  }
}
