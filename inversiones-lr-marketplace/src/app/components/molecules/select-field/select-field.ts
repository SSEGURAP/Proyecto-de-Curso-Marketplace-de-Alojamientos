import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Select } from '../../atoms/select/select';
import { Label } from '../../atoms/label/label';

@Component({
  imports: [Label, Select],
  selector: 'app-select-field',
  styleUrl: './select-field.css',
  templateUrl: './select-field.html',
})
export class SelectField {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Todas';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
