import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/produc.model';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { ProductPayload, ProductService } from '../../core/services/product';
import { UsuariosDataService } from '../../core/services/usuarios-data';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  allProducts: Product[] = [];
  product: Product[] = [];
  isAdmin = false;

  modalVisible = false;
  editingProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private el: ElementRef,
    private authService: UsuariosDataService,
    private confirmDialog: ConfirmDialogService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProducts();

    this.route.queryParams.subscribe(params => {
      this.applyFilter(params['q']);
      if (params['q']) {
        setTimeout(() => {
          this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.applyFilter();
      this.cdr.detectChanges();
    });
  }

  private applyFilter(query?: string): void {
    if (!query || !query.trim()) {
      this.product = this.allProducts;
      return;
    }
    const q = query.toLowerCase();
    this.product = this.allProducts.filter(p =>
      p.nombre?.toLowerCase().includes(q) ||
      p.marca?.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q) ||
      (p.categoria && p.categoria.nombre && p.categoria.nombre.toLowerCase().includes(q))
    );
  }

  // ── Admin actions ──

  openCreate(): void {
    // Al crear, aseguramos que no haya producto seleccionado
    this.editingProduct = null;
    this.modalVisible = true;
  }

  openEdit(product: Product, event: Event): void {
    // Evita propagación y comportamiento por defecto
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Setea el producto a editar y abre el modal
    this.editingProduct = product;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.editingProduct = null;
    this.modalVisible = false;
  }

  onSave(payload: ProductPayload): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, payload).subscribe(() => {
        console.log('Producto actualizado');
        this.closeModal();
        this.loadProducts();
      });
    } else {
      this.productService.createProduct(payload).subscribe(() => {
        console.log('Producto creado');
        this.closeModal();
        this.loadProducts();
      });
    }
  }

  onDelete(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.confirmDialog.confirm({
      title: 'Eliminar producto',
      message: `¿Eliminar variante ${product.nombre}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then((confirmed) => {
      if(confirmed) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            console.log('Producto eliminado');
            this.allProducts = this.allProducts.filter(p => p.id !== product.id);
            this.applyFilter();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error eliminando variante:', err);
          }, 
        });
      }
    });
  }
}
