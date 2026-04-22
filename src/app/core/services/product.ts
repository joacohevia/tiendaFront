import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product, ProductCategory } from '../models/produc.model';
import { Api, API_BASE_URL } from './api';

export interface ProductPayload {
  id_categoria: string;
  nombre: string;
  descripcion: string;
  precio_base: number;
  marca: string;
  img: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private api: Api) {}

  getProducts(): Observable<Product[]> {
    return this.api.http.get<Product[]>(`${API_BASE_URL}/productos`);
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.api.http.get<any[]>(`${API_BASE_URL}/listar`).pipe(
      map(cats => cats.map(c => ({ id: c.id_categoria, nombre: c.nombre })))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.api.http.get<any>(`${API_BASE_URL}/productos/${id}`).pipe(
      map(data => ({
        ...data,
        variantes: data.variantes?.map((v: any) => ({
          ...v,
          id_variante: v.id,
          id_producto: data.id,
        })),
      }))
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.api.http.get<Product[]>(`${API_BASE_URL}/productos/categoria/${categoryId}`);
  }

  createProduct(data: ProductPayload): Observable<any> {
    return this.api.http.post(`${API_BASE_URL}/productos`, data);
  }

  updateProduct(id: number, data: ProductPayload): Observable<any> {
    return this.api.http.put(`${API_BASE_URL}/productos/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.api.http.delete(`${API_BASE_URL}/productos/${id}`);
  }

  createVariant(productId: number, data: { talle?: string; color?: string; precio: number; stock: number }): Observable<any> {
    return this.api.http.post(`${API_BASE_URL}/productos/${productId}/variantes`, data);
  }

  deleteVariant(variantId: number): Observable<any> {
    return this.api.http.delete(`${API_BASE_URL}/variantes/${variantId}`);
  }
}
