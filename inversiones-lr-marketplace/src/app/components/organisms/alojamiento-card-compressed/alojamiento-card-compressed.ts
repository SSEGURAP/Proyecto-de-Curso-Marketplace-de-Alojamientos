import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Photo } from '../../atoms/photo/photo';
import { Badge } from '../../atoms/badge/badge';
import { Label } from '../../atoms/label/label';
import { PriceTag } from '../../molecules/price-tag/price-tag';
import { Button } from '../../atoms/button/button';
import { Alojamiento } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-alojamiento-card-compressed',
  standalone: true,
  imports: [Photo, Badge, Label, PriceTag, Button],
  templateUrl: './alojamiento-card-compressed.html',
  styleUrl: './alojamiento-card-compressed.css',
})
export class AlojamientoCardCompressed {

  @Input() alojamiento!: Alojamiento;
  @Output() viewDetail = new EventEmitter<number>();

  getUbicacion(): string {
    if (this.alojamiento.ubicacion.includes(this.alojamiento.ciudad)) {
      return this.alojamiento.ubicacion;
    }
    return this.alojamiento.ubicacion + ', ' + this.alojamiento.ciudad;
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.alojamiento.id);
  }
}