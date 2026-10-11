import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Select } from '../../atoms/select/select';
import { Label } from '../../atoms/label/label';
import { OpcionSelect } from '../../../models/alojamiento.model';

@Component({
  imports: [Label, Select],
  selector: 'app-select-field',
  styleUrl: './select-field.css',
  templateUrl: './select-field.html',
})
export class SelectField implements OnChanges {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() placeholder: string = 'Todas';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  opciones: OpcionSelect[] = [];

  ngOnChanges(): void {
    this.opciones = this.options.map(opcion => ({ valor: opcion, texto: opcion }));
  }

  onValueChange(valor: string | number): void {
    this.valueChange.emit(String(valor));
  }
}
