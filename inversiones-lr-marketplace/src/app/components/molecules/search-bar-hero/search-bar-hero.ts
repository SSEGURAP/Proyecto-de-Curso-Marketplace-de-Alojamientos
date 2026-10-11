import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Select } from '../../atoms/select/select';
import { InputComponent } from '../../atoms/input/input';
import { OpcionSelect, ParametrosBusqueda } from '../../../models/alojamiento.model';
import { obtenerHoyLocal } from '../../../utils/fecha.util';

@Component({
  selector: 'app-search-bar-hero',
  standalone: true,
  imports: [Select, InputComponent],
  templateUrl: './search-bar-hero.html',
  styleUrl: './search-bar-hero.css',
})
export class SearchBarHero implements OnChanges {

  @Input() ciudades: string[] = [];

  @Output() search = new EventEmitter<ParametrosBusqueda>();

  ciudad: string = '';
  llegada: string = '';
  salida: string = '';
  huespedes: number = 1;
  error: string = '';

  opcionesCiudad: OpcionSelect[] = [];
  readonly opcionesHuespedes: OpcionSelect[] = Array.from({ length: 10 }, (_, i) => ({
    valor: i + 1,
    texto: (i + 1) + (i === 0 ? ' huésped' : ' huéspedes')
  }));
  readonly hoy: string = obtenerHoyLocal();

  ngOnChanges(): void {
    this.opcionesCiudad = this.ciudades.map(ciudad => ({ valor: ciudad, texto: ciudad }));
  }

  onCiudadChange(valor: string | number): void {
    this.ciudad = String(valor);
    this.error = '';
  }

  onLlegadaChange(valor: string): void {
    this.llegada = valor;
    if (this.llegada && this.salida && this.salida <= this.llegada) {
      this.salida = '';
    }
    this.error = '';
  }

  onSalidaChange(valor: string): void {
    this.salida = valor;
    this.error = '';
  }

  onHuespedesChange(valor: string | number): void {
    this.huespedes = Number(valor);
    this.error = '';
  }

  onSearchClick(): void {
    this.error = this.validar();
    if (this.error) {
      return;
    }
    this.search.emit({
      ciudad: this.ciudad,
      llegada: this.llegada,
      salida: this.salida,
      huespedes: this.huespedes
    });
  }

  private validar(): string {
    if ((this.llegada && !this.salida) || (!this.llegada && this.salida)) {
      return 'Selecciona la fecha de llegada y la de salida.';
    }
    if (this.llegada && this.llegada < this.hoy) {
      return 'La llegada no puede ser anterior a hoy.';
    }
    if (this.llegada && this.salida && this.salida <= this.llegada) {
      return 'La salida debe ser posterior a la llegada.';
    }
    return '';
  }
}
