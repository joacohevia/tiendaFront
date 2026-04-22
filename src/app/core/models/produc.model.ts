export interface ProductVariant {
  id_variante: number;
  id_producto: number;
  talle: string | null;
  color: string | null;
  precio: number;//precio tambien
  stock: number;//necesito el stock
  quantity?: number;
}

export interface ProductCategory {
  id: number;
  nombre: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  marca: string;
  imagen: string;
  activo: boolean;
  categoria: ProductCategory;
  variantes?: ProductVariant[];
  quantity?: number;
}

export interface CartItem {
  producto: Product;
  variante: ProductVariant;
  quantity: number;
}
