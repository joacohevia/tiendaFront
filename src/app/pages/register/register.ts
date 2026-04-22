import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosDataService } from '../../core/services/usuarios-data';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  nombre = '';
  apellido = '';
  dni = '';
  celular = '';
  email = '';
  password = '';
  showPassword = false;
  errorMsg = signal('');
  successMsg = signal('');
  overlayMsg = signal('');
  overlayType = signal<'success' | 'error'>('success');

  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(
    private authService: UsuariosDataService,
    private router: Router,
  ) {}

  closeOverlay(): void {
    this.overlayMsg.set('');
  }

  onSubmit(): void {
    Object.values(this.registerForm.controls).forEach(c => c.markAsTouched());
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMsg.set('');
    this.successMsg.set('');
    this.overlayMsg.set('');

    this.authService.register({
      nombre: this.nombre,
      apellido: this.apellido,
      dni: this.dni,
      celular: this.celular,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.overlayType.set('success');
        this.overlayMsg.set('Cuenta creada correctamente');
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          const msg: string = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          console.log('Mensaje de la API:', msg); // para verificar qué llega
          this.overlayType.set('error');
          if (msg.toLowerCase().includes('dni')) {
            this.overlayMsg.set('El DNI ingresado ya está registrado');
          } else if (msg.toLowerCase().includes('email')) {
            this.overlayMsg.set('El email ingresado ya está registrado');
          } else {
            this.overlayMsg.set('Los datos ingresados ya están registrados');
          }
        } else {
          this.errorMsg.set('No se pudo crear la cuenta. Intentá de nuevo.');
        }
      },
    });
  }
}
