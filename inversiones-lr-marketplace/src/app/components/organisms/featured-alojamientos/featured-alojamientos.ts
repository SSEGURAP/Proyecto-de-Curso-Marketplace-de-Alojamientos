import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Label } from '../../atoms/label/label';
import { AlojamientoCardCompressed } from '../alojamiento-card-compressed/alojamiento-card-compressed';
import { Alojamiento } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-featured-alojamientos',
  standalone: true,
  imports: [Label, AlojamientoCardCompressed, RouterLink],
  templateUrl: './featured-alojamientos.html',
  styleUrl: './featured-alojamientos.css',
})
export class FeaturedAlojamientos {

  @Input() alojamientosDestacados: Alojamiento[] = [];
  @Input() cargando: boolean = true;

  @Output() viewDetail = new EventEmitter<number>();

  onViewDetail(id: number): void {
    this.viewDetail.emit(id);
  }
}
