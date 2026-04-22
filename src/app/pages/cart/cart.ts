import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { CartItem } from '../../core/models/produc.model';
import { ClothesCartService } from '../../core/services/clothes-cart.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { UsuariosDataService } from '../../core/services/usuarios-data';
@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit{
  cartItems$: Observable<CartItem[]>;
  
  constructor(
    private cart: ClothesCartService,
    private authService: UsuariosDataService,
    private pedidosService: PedidosService,
    private router: Router
  ){
    this.cartItems$ = cart.cartItems$.asObservable();
  }

  clearCart(): void {
    this.cart.clearCart();
  }

  comprar(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const idUsuario = this.authService.getUsuarioId()!;
    const items = this.cart.cartItems$.value;

    if (items.length === 0) {
      return;
    }
    this.pedidosService.crearPedido(idUsuario).subscribe({
      next: (res) => {
        const idPedido = res.id_pedido;
        //console.log('Pedido creado con id:', idPedido);
        //this.router.navigate(['/mis-pedidos']);
        const requests = items.map(item =>
          this.pedidosService.agregarProducto(
            idPedido,
            item.variante.id_variante,
            item.quantity,
            item.variante.precio
          )
        );

        forkJoin(requests).subscribe({
          next: (results) => {
            console.log('Productos agregados al pedido:', results);
            this.clearCart();
            this.notificarAdmin(idPedido, items);  // ← agregás esto acá
            this.router.navigate(['/mis-pedidos']); // ← lo movés para acá
          },
          error: (err) => console.error('Error al agregar productos:', err),
        });
      },
      error: (err) => console.error('Error al crear pedido:', err),
    });
  }
  notificarAdmin(idPedido: number, items: CartItem[]): void {
  const detalle = items
    .map(item => `• ${item.producto.nombre} - ${item.variante.color} - Talle ${item.variante.talle} x${item.quantity} - $${item.variante.precio}`)
    .join('\n');

  const total = items.reduce((acc, item) => acc + item.variante.precio * item.quantity, 0);

  const mensaje =
    `Hola quisiera realizar un ` +
    `nuevo pedido #${idPedido}\n\n` +
    `${detalle}\n\n` +
    `Total: $${total}`;

  const numeroAdmin = '2494370414'; // reemplazá con el número real
  const url = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
  ngOnInit(): void {
    
  }
}
