import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Label } from '../../atoms/label/label';
import { IconButton } from '../../atoms/icon-button/icon-button';

@Component({
  imports: [Label, IconButton],
  selector: 'app-counter-field',
  styleUrl: './counter-field.css',
  templateUrl: './counter-field.html',
})
export class CounterField {
  @Input() label: string = '';
  @Input() unit: string = '';
  @Input() value: number = 1;
  @Input() min: number = 1;
  @Input() max: number = 10;
  @Output() valueChange = new EventEmitter<number>();

  increase(): void{
    if (this.value < this.max) {
      this.value++;
      this.valueChange.emit(this.value);
    }
  }

  decrease(): void{
    if (this.value > this.min) {
      this.value--;
      this.valueChange.emit(this.value);
    }
  }
}
