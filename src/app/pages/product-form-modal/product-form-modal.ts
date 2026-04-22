import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Product, ProductCategory } from '../../core/models/produc.model';
import { ProductPayload, ProductService } from '../../core/services/product';


@Component({
  selector: 'app-product-form-modal',
  standalone: false,
  templateUrl: './product-form-modal.html',
  styleUrl: './product-form-modal.scss',
})

export class ProductFormModal implements OnChanges, OnInit {
  @Input() product: Product | null = null;
  @Input() visible = false;
  @Output() save = new EventEmitter<ProductPayload>();
  @Output() close = new EventEmitter<void>();

  categorias: ProductCategory[] = [];
  nombre = '';
  descripcion = '';
  precio_base = 0;
  marca = '';
  img = '';
  id_categoria = '';
  activo = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categorias = cats;
    });
  }

  ngOnChanges(): void {
    if (this.product) {
      this.nombre = this.product.nombre;
      this.descripcion = this.product.descripcion;
      this.precio_base = this.product.precio;
      this.marca = this.product.marca;
      this.img = this.product.imagen;
      this.id_categoria = String(this.product.categoria?.id ?? '');
      this.activo = this.product.activo;
    } else {
      this.resetForm();
    }
  }

  get isEdit(): boolean {
    return this.product !== null;
  }

  onSubmit(): void {
    const payload: ProductPayload = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio_base: this.precio_base,
      marca: this.marca,
      img: this.img,
      id_categoria: this.id_categoria,
      activo: this.activo,
    };
    this.save.emit(payload);
  }

  onClose(): void {
    this.close.emit();
  }

  private resetForm(): void {
    this.nombre = '';
    this.descripcion = '';
    this.precio_base = 0;
    this.marca = '';
    this.img = '';
    this.id_categoria = '';
    this.activo = true;
  }
}
