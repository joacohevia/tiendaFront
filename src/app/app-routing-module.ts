import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { About } from './pages/about/about';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { MisPedidos } from './pages/mis-pedidos/mis-pedidos';
import { MisUsuarios } from './pages/mis-usuarios/mis-usuarios';
import { NotFound } from './pages/not-found/not-found';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Products } from './pages/products/products';
import { Register } from './pages/register/register';
import { UserConfig } from './pages/user-config/user-config';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'productos', 
    pathMatch: 'full' 
  },
  //{ path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'productos', component: Products },
  { path: 'producto/:id', component: ProductDetail },
  { path: 'carrito', component: Cart },
  { path: 'mis-pedidos', component: MisPedidos, canActivate: [authGuard] },
  { path: 'perfil', component: UserConfig, canActivate: [authGuard] },
  { path: 'not-found', component: NotFound},
  { path: 'registro', component: Register},
  { path: 'contacto', component: About},
  { path: 'mis-usuarios', component: MisUsuarios},
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({// se agrego scrollPositionRestoration: 'top' cualquier ruta scrol hacia arriba 
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
