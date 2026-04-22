import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosDataService } from '../../core/services/usuarios-data';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  showPassword = false;
  email = '';
  password = '';
  errorMsg = '';
  successMsg = '';

  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(private authService: UsuariosDataService, private router: Router) {}

  onSubmit(): void {
    // Limpia errores custom del intento anterior para que el form se re-evalúe limpio
    Object.values(this.loginForm.controls).forEach(c => c.setErrors(null));
    this.errorMsg = '';

    // Marca todos los campos como "touched" para que se muestren los errores inline
    Object.values(this.loginForm.controls).forEach(control => control.markAsTouched());

    // Si el formulario es inválido, corta acá (los mensajes ya se muestran en el HTML)
    if (this.loginForm.invalid) {
      return;
    }
    // Sanitización antes de enviar
    const email    = this.loginForm.value.email.trim().toLowerCase();
    const password = this.loginForm.value.password.trim();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.successMsg = 'Ingreso exitoso';
        document.body.style.overflow = 'hidden';  // bloquea el scroll
        setTimeout(() => {
          document.body.style.overflow = '';       // lo restaura al navegar
          this.router.navigate(['/productos']);}, 2000);
      },
      error: () => {
        // Muestra el mensaje general arriba del form
        this.errorMsg = 'Credenciales incorrectas';
        // Marca cada control como "touched" + le setea un error custom
        // para que se activen las mismas advertencias inline en los inputs
        Object.values(this.loginForm.controls).forEach(c => {
          c.markAsTouched();             // activa la condición "touched" del *ngIf
          c.setErrors({ incorrect: true }); // lo marca como inválido → muestra el <span> de error
        });
      },
    });
  }
}