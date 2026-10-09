import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RangeField } from '../../molecules/range-field/range-field';
import { CheckboxGroup } from '../../molecules/checkbox-group/checkbox-group';
import { CounterField } from '../../molecules/counter-field/counter-field';
import { SelectField } from '../../molecules/select-field/select-field';
import { Button } from '../../atoms/button/button';
import { Label } from '../../atoms/label/label';
import { FiltroAlojamiento } from '../../../models/alojamiento.model';

@Component({
  imports: [Label, Button, SelectField, CounterField, CheckboxGroup, RangeField],
  selector: 'app-filter-sidebar',
  styleUrl: './filter-sidebar.css',
  templateUrl: './filter-sidebar.html',
})
export class FilterSidebar implements OnChanges {
  @Input() ciudades: string[] = [];
  @Input() tipos: string[] = [];
  @Input() precioLimite: number = 1000000;
  @Output() filtersChange = new EventEmitter<FiltroAlojamiento>();

  ciudad: string = '';
  huespedes: number = 1;
  tiposSeleccionados: string[] = [];
  precioMaximo: number = 1000000;

  /**
   * precioLimite llega de forma asíncrona (cuando termina de cargar el JSON).
   * ngOnInit solo veía el valor por defecto; ngOnChanges sincroniza el slider
   * con el precio máximo real cada vez que el límite cambia.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['precioLimite']) {
      this.precioMaximo = this.precioLimite;
    }
  }

  onCiudadChange(ciudad: string): void {
    this.ciudad = ciudad;
    this.emitFilters();
  }

  onHuespedesChange(huespedes: number): void {
    this.huespedes = huespedes;
    this.emitFilters();
  }

  onTiposChange(tipos: string[]): void {
    this.tiposSeleccionados = tipos;
    this.emitFilters();
  }

  onPrecioChange(precio: number): void {
    this.precioMaximo = precio;
    this.emitFilters();
  }

  clearFilters(): void {
    this.ciudad = '';
    this.huespedes = 1;
    this.tiposSeleccionados = [];
    this.precioMaximo = this.precioLimite;
    this.emitFilters();
  }

  emitFilters(): void {
    this.filtersChange.emit({
      ciudad: this.ciudad || undefined,
      huespedes: this.huespedes,
      tipos: this.tiposSeleccionados,
      precioMaximo: this.precioMaximo,
    });
  }
}