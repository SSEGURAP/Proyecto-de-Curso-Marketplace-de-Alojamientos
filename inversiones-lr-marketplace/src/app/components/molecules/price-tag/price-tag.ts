import { Component, Input } from '@angular/core';
import { Label } from '../../atoms/label/label';

@Component({
  imports: [Label],
  selector: 'app-price-tag',
  styleUrl: './price-tag.css',
  templateUrl: './price-tag.html',
})
export class PriceTag {
  @Input() price: number = 0;
  @Input() unit: string = 'noche';

  formatPrice(): string {
    return '$' + this.price.toLocaleString('es-CO') + ' COP';
  }
}
