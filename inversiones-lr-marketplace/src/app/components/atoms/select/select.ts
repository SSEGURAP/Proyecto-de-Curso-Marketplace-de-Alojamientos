import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpcionSelect } from '../../../models/alojamiento.model';

@Component({
  imports: [FormsModule],
  selector: 'app-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
})
export class Select {
  @Input() options: OpcionSelect[] = [];
  @Input() placeholder: string = '';
  @Input() value: string | number = '';
  @Input() variant: 'filled' | 'plain' = 'filled';
  @Input() ariaLabel: string = '';
  @Output() valueChange = new EventEmitter<string | number>();

  onHandleChange(value: string | number): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}
