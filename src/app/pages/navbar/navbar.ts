import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Usuario } from '../../core/models/user.model';
import { ClothesCartService } from '../../core/services/clothes-cart.service';
import { UsuariosDataService } from '../../core/services/usuarios-data';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  searchOpen = false;
  searchTerm = '';
  cartCount$: Observable<number>;
  usuario$: Observable<Usuario | null>;
  isAdmin$: Observable<boolean>;
  isMenuOpen = false;

  constructor(
    private router: Router,
    private cartService: ClothesCartService,
    private authService: UsuariosDataService
  ) {
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.quantity, 0))
    );
    this.usuario$ = this.authService.usuario$;
    this.isAdmin$ = this.authService.usuario$.pipe(
      map(u => u?.rol === 'admin')
    );
  }

  ngOnInit(): void {
    this.setupMenuCloseOnClickOutside();
  }

  private setupMenuCloseOnClickOutside(): void {
    // Escuchar clicks en el documento
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const hamburgerMenu = document.querySelector('.hamburger-menu');
      const hamburgerToggle = document.getElementById('hamburger-toggle') as HTMLInputElement;
      const navbar = document.querySelector('nav.navbar');
      
      // Si el menú está abierto y el click fue fuera del menú y fuera del navbar
      if (hamburgerToggle && hamburgerToggle.checked) {
        // Verificar que el click no fue dentro del menú hamburguesa ni en el navbar
        const isClickOutside = !hamburgerMenu?.contains(target) && !navbar?.contains(target);
        
        if (isClickOutside) {
          hamburgerToggle.checked = false;
        }
      }
    });
  }
  
  closeMenu(): void {
    const checkbox = document.getElementById('hamburger-toggle') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  } 
  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    if (!this.searchOpen) {
      this.searchTerm = '';
    }
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/productos'], { queryParams: { q: this.searchTerm.trim() } });
      this.searchOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  buscarCategoria(categoria: string): void {
    this.router.navigate(['/productos'], { queryParams: { q: categoria } });
    this.searchOpen = false;
  }
}
