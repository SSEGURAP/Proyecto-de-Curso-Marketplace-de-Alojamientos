import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
})
export class Select {
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onHandleChange(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}
