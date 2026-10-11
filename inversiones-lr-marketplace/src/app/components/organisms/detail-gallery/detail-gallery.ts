import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';

@Component({
  imports: [IconComponent],
  selector: 'app-detail-gallery',
  styleUrl: './detail-gallery.css',
  templateUrl: './detail-gallery.html',
})
export class DetailGallery {
  @Input() imagenes: string[] = [];
  @Input() alt: string = '';
  @Output() abrirFoto = new EventEmitter<number>();

  getImagenesGaleria(): string[] {
    return this.imagenes.slice(0, 5);
  }

  onAbrirFoto(indice: number): void {
    this.abrirFoto.emit(indice);
  }
}
