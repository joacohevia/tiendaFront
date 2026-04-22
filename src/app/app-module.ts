import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { About } from './pages/about/about';
import { Carrousel } from './pages/carrousel/carrousel';
import { Cart } from './pages/cart/cart';
import { ConfirmDialog } from './pages/confirm-dialog/confirm-dialog';
import { Footer } from './pages/footer/footer';
import { Login } from './pages/login/login';
import { MisPedidos } from './pages/mis-pedidos/mis-pedidos';
import { MisUsuarios } from './pages/mis-usuarios/mis-usuarios';
import { Navbar } from './pages/navbar/navbar';
import { NotFound } from './pages/not-found/not-found';
import { ProductDetail } from './pages/product-detail/product-detail';
import { ProductFormModal } from './pages/product-form-modal/product-form-modal';
import { ProductList } from './pages/product-list/product-list';
import { Products } from './pages/products/products';
import { Register } from './pages/register/register';
import { UserConfig } from './pages/user-config/user-config';

@NgModule({
  declarations: [
    App,
    Login,
    Products,
    Cart,
    ProductList,
    ProductDetail,
    Footer,
    Navbar,
    Carrousel,
    NotFound,
    Register,
    About,
    MisPedidos,
    ProductFormModal,
    UserConfig,
    MisUsuarios,
    ConfirmDialog,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
