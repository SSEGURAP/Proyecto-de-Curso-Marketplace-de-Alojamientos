import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceList } from '../../molecules/service-list/service-list';
import { PriceTag } from '../../molecules/price-tag/price-tag';
import { PhotoRating } from '../../molecules/photo-rating/photo-rating';
import { Button } from '../../atoms/button/button';
import { Label } from '../../atoms/label/label';
import { Alojamiento } from '../../../models/alojamiento.model';

@Component({
  imports: [Label, Button, PhotoRating, PriceTag, ServiceList],
  selector: 'app-alojamiento-card',
  styleUrl: './alojamiento-card.css',
  templateUrl: './alojamiento-card.html',
})
export class AlojamientoCard {
  @Input() alojamiento!: Alojamiento;
  @Output() viewDetail = new EventEmitter<number>();

  getUbicacion(): string {
    if (this.alojamiento.ubicacion.includes(this.alojamiento.ciudad)) {
      return this.alojamiento.ubicacion;
    }
    return this.alojamiento.ubicacion + ', ' + this.alojamiento.ciudad;
  }

  getDetalle(): string {
    return this.alojamiento.tipo + ' · ' + this.alojamiento.capacidad + ' huéspedes';
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.alojamiento.id);
  }
}
