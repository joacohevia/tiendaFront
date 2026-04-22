import { Component, ViewChild } from '@angular/core';
import { ConfirmDialogConfig, ConfirmDialogService } from './core/services/confirm-dialog.service';
import { ConfirmDialog } from './pages/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  title = 'Bienvenido a JH deportivo';

  // Referencia al componente confirm-dialog
  @ViewChild(ConfirmDialog) confirmDialogComp?: ConfirmDialog;

  // Estado del modal
  confirmVisible = false;
  confirmConfig: ConfirmDialogConfig = { message: '' };

  constructor(private confirmDialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del servicio
    this.confirmDialogService.getConfig$().subscribe(config => {
      if (config) {
        this.confirmConfig = config;
        this.confirmVisible = true;
      } else {
        this.confirmVisible = false;
      }
    });
  }

  // Cuando el usuario confirma
  onConfirm(): void {
    this.confirmDialogService.onConfirm();
    this.confirmVisible = false;
  }

  // Cuando el usuario cancela
  onCancel(): void {
    this.confirmDialogService.onCancel();
    this.confirmVisible = false;
  }

  scrollToTop(event: Event): void {
    event.preventDefault(); // evita que el enlace recargue la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
