import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductVariant } from '../../core/models/produc.model';
import { ClothesCartService } from '../../core/services/clothes-cart.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';
import { ProductService } from '../../core/services/product';
import { UsuariosDataService } from '../../core/services/usuarios-data';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;

  // Carrusel de imágenes
  images: string[] = [];
  currentImgIndex = 0;

  // Listas únicas extraídas de variantes
  colores: string[] = [];
  talles: string[] = [];

  // Selección del usuario
  selectedColor: string | null = null;
  selectedTalle: string | null = null;
  selectedVariant: ProductVariant | null = null;

  // Admin
  isAdmin = false;
  showVariantForm = false;
  newVariant = { talle: '', color: '', precio: 0, stock: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cart: ClothesCartService,
    private authService: UsuariosDataService,
    private cdr: ChangeDetectorRef,
    private confirmDialog: ConfirmDialogService  
  ) {
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        console.log('Detalle producto API:', data);
        this.product = { ...data, quantity: 0 };
        this.images = this.product.imagen ? [this.product.imagen] : [];
        this.extractVariantInfo();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudo cargar el producto.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      },
    });
  }

  private extractVariantInfo(): void {
    if (!this.product?.variantes) return;
    this.colores = [...new Set(
      this.product.variantes.map(v => v.color).filter((c): c is string => !!c)
    )];
    this.talles = [...new Set(
      this.product.variantes.map(v => v.talle).filter((t): t is string => !!t)
    )];
  }

  prevImg(): void {
    this.currentImgIndex = this.currentImgIndex === 0
      ? this.images.length - 1
      : this.currentImgIndex - 1;
  }

  nextImg(): void {
    this.currentImgIndex = this.currentImgIndex === this.images.length - 1
      ? 0
      : this.currentImgIndex + 1;
  }
  // PASO 2 (componente): Recibe la variante con la cantidad elegida por el usuario.
  // Llama al servicio addCart() pasando el producto y la variante.
  // Luego descuenta el stock visual y resetea la cantidad a 0.
  addCart(variant: ProductVariant): void {
    if (this.product && variant.quantity && variant.quantity > 0) {
      this.cart.addCart(this.product, variant);
      variant.stock -= variant.quantity;
      variant.quantity = 0;
    }
  }

  selectColor(color: string): void {
    this.selectedColor = this.selectedColor === color ? null : color;
    this.updateSelectedVariant();
  }

  selectTalle(talle: string): void {
    this.selectedTalle = this.selectedTalle === talle ? null : talle;
    this.updateSelectedVariant();
  }

  private updateSelectedVariant(): void {
    if (!this.product?.variantes || !this.selectedColor || !this.selectedTalle) {
      this.selectedVariant = null;
      return;
    }
    this.selectedVariant = this.product.variantes.find(v =>
      v.color === this.selectedColor && v.talle === this.selectedTalle
    ) ?? null;
  }

  addSelectedToCart(): void {
    if (!this.product || !this.selectedVariant || this.selectedVariant.stock <= 0) return;

    // Si no está logueado, redirige al login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.selectedVariant.quantity = 1;
    this.cart.addCart(this.product, this.selectedVariant);
    this.selectedVariant.stock -= 1;
    this.selectedVariant.quantity = 0;
  }

  maxReached(): void {
    alert('Se alcanzó el máximo permitido.');
  }

  deleteSelectedVariant(): void {
    if (!this.selectedVariant) return;

    const variantLabel = `${this.selectedVariant.talle ?? ''} ${this.selectedVariant.color ?? ''}`.trim();
    console.log(variantLabel);
    this.confirmDialog.confirm({
      title: 'Eliminar variante',
      message: `¿Eliminar variante ${variantLabel}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then((confirmed) => {
      if (confirmed) {
        this.productService.deleteVariant(this.selectedVariant!.id_variante).subscribe({
          next: () => {
            console.log('Variante eliminada');
            this.selectedColor = null;
            this.selectedTalle = null;
            this.selectedVariant = null;
            this.reloadProduct();
          },
          error: (err) => {
            console.error('Error eliminando variante:', err);
          },
        });
      }
    });
  }
 

  toggleVariantForm(): void {
    this.showVariantForm = !this.showVariantForm;
    this.newVariant = { talle: '', color: '', precio: this.product?.precio ?? 0, stock: 0 };
  }

  submitVariant(): void {
    if (!this.product) return;
    const payload: any = {
      precio: this.newVariant.precio,
      stock: this.newVariant.stock,
    };
    if (this.newVariant.talle) payload.talle = this.newVariant.talle;
    if (this.newVariant.color) payload.color = this.newVariant.color;

    this.productService.createVariant(this.product.id, payload).subscribe({
      next: () => {
        console.log('Variante creada');
        this.showVariantForm = false;
        this.reloadProduct();
      },
      error: (err) => {
        console.error('Error creando variante:', err);
      },
    });
  }

  private reloadProduct(): void {
    if (!this.product) return;
    this.productService.getProductById(this.product.id).subscribe({
      next: (data) => {
        this.product = { ...data, quantity: 0 };
        this.images = this.product.imagen ? [this.product.imagen] : [];
        this.selectedColor = null;
        this.selectedTalle = null;
        this.selectedVariant = null;
        this.extractVariantInfo();
        this.cdr.detectChanges();
      },
    });
  }
}
