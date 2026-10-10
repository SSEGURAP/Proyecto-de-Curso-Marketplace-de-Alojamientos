import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../atoms/icon/icon';
import { ParametrosBusqueda } from '../../../models/alojamiento.model';
import { obtenerHoyLocal } from '../../../utils/fecha.util';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {

  /** Ciudades disponibles (las provee el organismo Header desde el servicio). */
  @Input() ciudades: string[] = [];

  /** Emite los mismos datos que SearchBarHero: ciudad, fechas y huéspedes. */
  @Output() search = new EventEmitter<ParametrosBusqueda>();

  ciudad: string = '';
  llegada: string = '';
  salida: string = '';
  huespedes: number = 1;
  error: string = '';

  readonly opcionesHuespedes: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly hoy: string = obtenerHoyLocal();

  onCampoChange(): void {
    this.error = '';
  }

  onLlegadaChange(): void {
    // Si la salida quedó antes (o igual) que la nueva llegada, se limpia.
    if (this.llegada && this.salida && this.salida <= this.llegada) {
      this.salida = '';
    }
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