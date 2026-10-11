import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';

@Component({
  imports: [IconComponent],
  selector: 'app-photo-viewer',
  styleUrl: './photo-viewer.css',
  templateUrl: './photo-viewer.html',
})
export class PhotoViewer {
  @Input() imagenes: string[] = [];
  @Input() indice: number = 0;
  @Input() alt: string = '';
  @Output() cerrar = new EventEmitter<void>();

  onCerrar(): void {
    this.cerrar.emit();
  }

  anterior(evento: Event): void {
    evento.stopPropagation();
    this.moverFoto(-1);
  }

  siguiente(evento: Event): void {
    evento.stopPropagation();
    this.moverFoto(1);
  }

  private moverFoto(paso: number): void {
    const total = this.imagenes.length;
    this.indice = (this.indice + paso + total) % total;
  }
}
