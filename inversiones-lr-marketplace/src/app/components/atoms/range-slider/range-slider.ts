import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-range-slider',
  styleUrl: './range-slider.css',
  templateUrl: './range-slider.html',
})
export class RangeSlider {
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = Number(target.value);
    this.valueChange.emit(this.value);
  }
}
