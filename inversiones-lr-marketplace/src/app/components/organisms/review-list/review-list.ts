import { Component, Input } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';
import { Resena } from '../../../models/alojamiento.model';

@Component({
  imports: [IconComponent],
  selector: 'app-review-list',
  styleUrl: './review-list.css',
  templateUrl: './review-list.html',
})
export class ReviewList {
  @Input() resenas: Resena[] = [];
  @Input() calificacion: number = 0;

  getEstrellas(calificacion: number): string {
    const llenas = Math.min(5, Math.max(0, Math.round(calificacion)));
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
  }

  getIniciales(nombre: string): string {
    const partes = nombre.trim().split(' ');
    let iniciales = '';
    for (const parte of partes.slice(0, 2)) {
      iniciales += parte.charAt(0).toUpperCase();
    }
    return iniciales;
  }
}
