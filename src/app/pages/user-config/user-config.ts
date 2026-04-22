import { ChangeDetectorRef, Component } from '@angular/core';
import { UsuariosDataService } from '../../core/services/usuarios-data';

@Component({
  selector: 'app-user-config',
  standalone: false,
  templateUrl: './user-config.html',
  styleUrl: './user-config.scss',
})
export class UserConfig {
  showPassword = false;
  showPasswordNueva = false;
  showPasswordConfirmar = false;
  passwordActual = '';
  passwordNueva = '';
  confirmarPassword = '';
  mensaje = '';
  error = '';
  loading = false;

  constructor(
    private authService: UsuariosDataService,
    private cdr: ChangeDetectorRef
  ) {}

  get passwordNoCoincide(): boolean {
    return this.confirmarPassword.length > 0 && this.passwordNueva !== this.confirmarPassword;
  }

  get passwordMuyCorta(): boolean {
    return this.passwordNueva.length > 0 && this.passwordNueva.length < 6;
  }

  get formValido(): boolean {
    return (
      this.passwordActual.length > 0 &&
      this.passwordNueva.length >= 6 &&
      this.passwordNueva === this.confirmarPassword &&
      !this.loading
    );
  }

  onSubmit(): void {
    this.mensaje = '';
    this.error = '';
    this.loading = true;

    this.authService.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: () => {
        this.mensaje = 'Contrase\u00f1a actualizada exitosamente.';
        this.passwordActual = '';
        this.passwordNueva = '';
        this.confirmarPassword = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'La contrase\u00f1a actual es incorrecta.';
        } else {
          this.error = 'Error al cambiar la contrase\u00f1a. Intent\u00e1 de nuevo.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
