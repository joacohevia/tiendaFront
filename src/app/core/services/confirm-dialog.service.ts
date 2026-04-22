import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmDialogConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogConfig$ = new BehaviorSubject<ConfirmDialogConfig | null>(null);
  private confirmCallback: ((result: boolean) => void) | null = null;

  getConfig$(): Observable<ConfirmDialogConfig | null> {
    return this.dialogConfig$.asObservable();
  }

  confirm(config: ConfirmDialogConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogConfig$.next(config);
      this.confirmCallback = (result: boolean) => {
        this.dialogConfig$.next(null);
        resolve(result);
      };
    });
  }

  onConfirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback(true);
    }
  }

  onCancel(): void {
    if (this.confirmCallback) {
      this.confirmCallback(false);
    }
  }
}