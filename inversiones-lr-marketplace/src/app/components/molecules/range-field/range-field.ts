import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RangeSlider } from '../../atoms/range-slider/range-slider';
import { Label } from '../../atoms/label/label';

@Component({
  imports: [Label, RangeSlider],
  selector: 'app-range-field',
  styleUrl: './range-field.css',
  templateUrl: './range-field.html',
})
export class RangeField {
  @Input() label: string = '';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  onValueChange(value: number): void {
    this.value = value;
    this.valueChange.emit(value);
  }

  formatPrice(): string {
    return '$' + this.value.toLocaleString('es-CO') + ' COP';
  }
}
