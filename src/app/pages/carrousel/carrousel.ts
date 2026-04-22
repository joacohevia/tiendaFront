import { Component } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  standalone: false,
  templateUrl: './carrousel.html',
  styleUrl: './carrousel.scss',
})
export class Carrousel {
  ofertas = [
    { imagen: 'https://placehold.co/1200x500/7c3aed/white?text=Oferta+1', titulo: '50% OFF en Calzados' },
    { imagen: 'https://placehold.co/1200x500/1a1a2e/white?text=Oferta+2', titulo: '3x2 en Buzos' },
    { imagen: 'https://placehold.co/1200x500/4c1d95/white?text=Oferta+3', titulo: 'Envío Gratis en Camperas' },
  ];

  currentIndex = 0;

  prev(): void {
    this.currentIndex = this.currentIndex === 0
      ? this.ofertas.length - 1
      : this.currentIndex - 1;
  }

  next(): void {
    this.currentIndex = this.currentIndex === this.ofertas.length - 1
      ? 0
      : this.currentIndex + 1;
  }
}
