import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  scrollToTop(event: Event): void {
  event.preventDefault(); // evita que el enlace recargue la página
  window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
