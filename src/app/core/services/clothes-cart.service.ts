import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product, ProductVariant } from '../models/produc.model';
//logica del carrito
@Injectable({
  providedIn: 'root'
})
export class ClothesCartService {

  private _cartItems: CartItem[] = [];
  cartItems$: BehaviorSubject<CartItem[]> = new BehaviorSubject(this._cartItems);

  // PASO 3 (servicio): Recibe el producto y la variante.
  // Busca si ya existe un item en el carrito con el mismo producto+talle+color.
  // Si no existe, crea un nuevo CartItem. Si ya existe, suma la cantidad (sin superar el stock).
  // Emite la lista actualizada a través del BehaviorSubject para que el componente Cart se entere.
  addCart(product: Product, variant: ProductVariant) {
    const maxStock = variant.stock;
    const cantidad = variant.quantity ?? 1;
    let item = this._cartItems.find(ci =>
      ci.variante.id_producto === variant.id_producto &&
      ci.variante.talle === variant.talle &&
      ci.variante.color === variant.color
    );
    if (!item) {
      this._cartItems.push({
        producto: product,
        variante: { ...variant },
        quantity: Math.min(cantidad, maxStock)
      });
    } else {
      const nuevaCantidad = item.quantity + cantidad;
      item.quantity = Math.min(nuevaCantidad, maxStock);
    }
    this.cartItems$.next([...this._cartItems]); // emite copia nueva para que Angular detecte el cambio
  }

  clearCart() {
    this._cartItems = [];
    this.cartItems$.next([...this._cartItems]);
  }

  constructor() { }
}
