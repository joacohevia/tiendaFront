import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { PedidoDetalleExtras, PedidoResumen, PedidosService } from '../../core/services/pedidos.service';
import { UsuariosDataService } from '../../core/services/usuarios-data';

@Component({
  selector: 'app-mis-pedidos',
  standalone: false,
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.scss',
})
export class MisPedidos implements OnInit {
  pedidos = signal<PedidoResumen[]>([]);
  loading = signal(true);
  loadingDetalle = signal(true);

  expandedPedidoId: number | null = null;
  detalleProductos: PedidoDetalleExtras[] = [];


  private idUsuario!: number;

  constructor(
    private pedidosService: PedidosService,
    private authService: UsuariosDataService,
    private router: Router,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    const idUsuario = this.authService.getUsuarioId();
    if (!idUsuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.idUsuario = idUsuario;
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidosService.getPedidosByUsuario(this.idUsuario).subscribe({
      next: (data) => {
        this.pedidos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.loading.set(false);
      },
    });
  }

  toggleDetalle(pedido: PedidoResumen): void {
    if (this.expandedPedidoId === pedido.id_pedido) {
      this.expandedPedidoId = null;
      this.detalleProductos = [];
      return;
    }
    this.expandedPedidoId = pedido.id_pedido;
    this.loadingDetalle.set(true);
    this.detalleProductos = [];
    this.pedidosService.getPedidoDetalle(pedido.id_pedido).subscribe({
      next: (detalle) => {
        //console.log('Detalle API response:', detalle);
        this.detalleProductos = detalle.productos;
        this.loadingDetalle.set(false);
      },
      error: (err) => {
        //console.error('Error al cargar detalle:', err);
        this.loadingDetalle.set(false);
      },
    });
  }

eliminarPedido(pedido: PedidoResumen, event: Event): void {
  event.stopPropagation();
  
  this.confirmDialog.confirm({
    title: 'Eliminar pedido',
    message: `¿Estás seguro de eliminar el pedido #${pedido.id_pedido}?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar'
  }).then((confirmed) => {
    if (!confirmed) return;
    
    this.pedidosService.deletePedido(pedido.id_pedido).subscribe({
      next: () => {
        if (this.expandedPedidoId === pedido.id_pedido) {
          this.expandedPedidoId = null;
          this.detalleProductos = [];
        }
        this.pedidos.set(this.pedidos().filter(p => p.id_pedido !== pedido.id_pedido));
      },
      error: (err) => console.error('Error al eliminar pedido:', err),
    });
  });
}

eliminarProducto(item: PedidoDetalleExtras): void {
  this.confirmDialog.confirm({
    title: 'Eliminar producto',
    message: `¿Eliminar "${item.producto_nombre}" del pedido?`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar'
  }).then((confirmed) => {
    if (!confirmed) return;
    
    this.pedidosService.deleteProductoPedido(item.id_pedido_producto).subscribe({
      next: (res) => {
        this.detalleProductos = this.detalleProductos.filter(p => p.id_pedido_producto !== item.id_pedido_producto);
        const pedidos = this.pedidos().map(p =>
          p.id_pedido === this.expandedPedidoId ? { ...p, total: res.nuevo_total } : p
        );
        this.pedidos.set(pedidos);
      },
      error: (err) => console.error('Error al eliminar producto:', err),
    });
  });
  }
}
