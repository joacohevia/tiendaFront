
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Usuario } from '../../core/models/user.model';
import { API_BASE_URL } from '../../core/services/api';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { PedidoDetalleExtras, PedidoResumen } from '../../core/services/pedidos.service';

@Component({
  selector: 'app-mis-usuarios',
  standalone: false,
  templateUrl: './mis-usuarios.html',
  styleUrl: './mis-usuarios.scss',
})

export class MisUsuarios implements OnInit {
  // Lista reactiva de usuarios con sus pedidos
  usuarios = signal<UsuarioWithPedidos[]>([]);
  // Estado de carga general
  loading = signal(true);
  // Estado de carga de pedidos de un usuario
  loadingDetalle = signal(false);
  // ID del usuario expandido actualmente
  expandedUsuarioId: number | null = null;
  // ID del pedido expandido actualmente
  expandedPedidoId: number | null = null;
  // Estado de carga del detalle de un pedido
  loadingDetallePedido = signal(false);

  constructor(
    private http: HttpClient,
    private confirmDialog: ConfirmDialogService 
  ) {}

  // Al inicializar el componente, carga todos los usuarios
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Trae todos los usuarios desde la API y los inicializa con pedidos vacíos
  cargarUsuarios() {
    this.loading.set(true); // activa spinner
    this.http.get<Usuario[]>(`${API_BASE_URL}/usuarios`).subscribe({
      next: usuarios => {
        // Mapea cada usuario agregando un array de pedidos vacío
        this.usuarios.set(usuarios.map(u => ({ ...u, pedidos: [] })));
        this.loading.set(false); // desactiva spinner
      },
      error: () => this.loading.set(false)
    });
  }

  // Expande o colapsa la fila de un usuario y carga sus pedidos si es necesario
  toggleUsuario(usuario: UsuarioWithPedidos) {
    if (this.expandedUsuarioId === usuario.id_usuario) {
      // Si ya está expandido, lo colapsa
      this.expandedUsuarioId = null;
      this.expandedPedidoId = null;
    } else {
      // Expande el usuario y carga sus pedidos
      this.expandedUsuarioId = usuario.id_usuario;
      this.expandedPedidoId = null;
      this.cargarPedidosUsuario(usuario);
    }
  }

  // Trae los pedidos de un usuario desde la API
  cargarPedidosUsuario(usuario: UsuarioWithPedidos) {
    this.loadingDetalle.set(true); // spinner de pedidos
    this.http.get<PedidoResumen[]>(`${API_BASE_URL}/pedidos/usuario/${usuario.id_usuario}`).subscribe({
      next: pedidos => {
        // Mapea cada pedido agregando un array de productos vacío
        usuario.pedidos = pedidos.map(p => ({ ...p, detalleProductos: [] }));
        this.usuarios.set([...this.usuarios()]); // fuerza actualización
        this.loadingDetalle.set(false);
      },
      error: () => this.loadingDetalle.set(false)
    });
  }

  // Expande o colapsa el detalle de un pedido y carga los productos si es necesario
  toggleDetallePedido(pedido: PedidoWithDetalle, event: Event) {
    event.stopPropagation(); // evita que se cierre el usuario
    if (this.expandedPedidoId === pedido.id_pedido) {
      // Si ya está expandido, lo colapsa
      this.expandedPedidoId = null;
    } else {
      // Expande el pedido y carga su detalle
      this.expandedPedidoId = pedido.id_pedido;
      this.cargarDetallePedido(pedido);
    }
  }

  // Trae los productos de un pedido desde la API
  cargarDetallePedido(pedido: PedidoWithDetalle) {
    this.loadingDetallePedido.set(true); // spinner de productos
    this.http.get<{ productos: PedidoDetalleExtras[] }>(`${API_BASE_URL}/pedidos/${pedido.id_pedido}`).subscribe({
      next: res => {
        // Asigna los productos al pedido
        pedido.detalleProductos = res.productos;
        this.usuarios.set([...this.usuarios()]); // fuerza actualización
        this.loadingDetallePedido.set(false);
      },
      error: () => this.loadingDetallePedido.set(false)
    });
  }

  // Cambia el estado de un pedido y si es pagado descuenta stock
  cambiarEstadoPedido(pedido: PedidoWithDetalle, nuevoEstado: string) {
  this.confirmDialog.confirm({
    title: 'Cambiar estado del pedido',
    message: `¿Seguro que quieres marcar el pedido #${pedido.id_pedido} como ${nuevoEstado}?`,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar'
  }).then((confirmed) => {
    if (!confirmed) return;
    
    this.http.put(`${API_BASE_URL}/pedidos/${pedido.id_pedido}`, { estado: nuevoEstado }).subscribe({
      next: () => {
        pedido.estado = nuevoEstado;
        if (nuevoEstado === 'pagado') {
          this.descontarStock(pedido);
        }
        this.usuarios.set([...this.usuarios()]);
        //alert('Estado actualizado');
        //console.log(pedido.detalleProductos);
      },
      error: () => alert('Error al actualizar el estado')
    });
  });
  }

  // Por cada producto del pedido, descuenta la cantidad del stock
  descontarStock(pedido: PedidoWithDetalle) {
    if (!pedido.detalleProductos) return;
    pedido.detalleProductos.forEach(item => { 
      //console.log(item.cantidad);
      // Llama a la API para descontar stock de cada variante
      this.http.put(`${API_BASE_URL}/pedidos/producto/descontar-stock/${item.id_variante}`, { cantidad: item.cantidad }).subscribe();
    });//paso el id variante a la tabla variante_productos que es un id unico
  }
    // Elimina un usuario por ID
  eliminarUsuario(usuario: UsuarioWithPedidos, event: Event) {
  event.stopPropagation();
  
  this.confirmDialog.confirm({
    title: 'Eliminar usuario',
    message: `¿Seguro que quieres eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar'
  }).then((confirmed) => {
    if (!confirmed) return;
    
    this.http.delete(`${API_BASE_URL}/usuarios/${usuario.id_usuario}`).subscribe({
      next: () => {
        this.usuarios.set(this.usuarios().filter(u => u.id_usuario !== usuario.id_usuario));
        //alert('Usuario eliminado');
      },
      error: () => alert('Error al eliminar usuario')
    });
  });
}

  // Cambia el rol de un usuario a admin
  hacerAdmin(usuario: UsuarioWithPedidos, event: Event) {
  event.stopPropagation();
  
  this.confirmDialog.confirm({
    title: 'Cambiar rol de usuario',
    message: `¿Seguro que quieres hacer admin a ${usuario.nombre} ${usuario.apellido}?`,
    confirmText: 'Hacer admin',
    cancelText: 'Cancelar'
  }).then((confirmed) => {
    if (!confirmed) return;
    
    this.http.put(`${API_BASE_URL}/usuarios/${usuario.id_usuario}/cambiar-rol`, { rol: 'admin' }).subscribe({
      next: () => {
        usuario.rol = 'admin';
        this.usuarios.set([...this.usuarios()]);
        //alert('Usuario ahora es admin');
      },
      error: () => alert('Error al cambiar el rol')
    });
  });
}

  // Elimina un pedido por ID
  eliminarPedido(pedido: PedidoWithDetalle, event: Event) {
  event.stopPropagation();
  
  this.confirmDialog.confirm({
    title: 'Eliminar pedido',
    message: `¿Seguro que quieres eliminar el pedido #${pedido.id_pedido}?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar'
  }).then((confirmed) => {
    if (!confirmed) return;
    
    this.http.delete(`${API_BASE_URL}/pedidos/${pedido.id_pedido}`).subscribe({
      next: () => {
        // Busca el usuario dueño del pedido y lo elimina de su lista
        const usuario = this.usuarios().find(u => u.pedidos.some(p => p.id_pedido === pedido.id_pedido));
        if (usuario) {
          usuario.pedidos = usuario.pedidos.filter(p => p.id_pedido !== pedido.id_pedido);
          this.usuarios.set([...this.usuarios()]);
        }
        //alert('Pedido eliminado');
      },
      error: () => alert('Error al eliminar pedido')
    });
  });
  }
}

// INTERFACES PARTICULARES DEL COMPONENTE
// UsuarioWithPedidos extiende Usuario agregando el array de pedidos a cada usuario
interface UsuarioWithPedidos extends Usuario {
  pedidos: PedidoWithDetalle[];
}
// PedidoWithDetalle extiende PedidoResumen agregando el array de productos a cada pedido
interface PedidoWithDetalle extends PedidoResumen {
  detalleProductos?: PedidoDetalleExtras[];
}
