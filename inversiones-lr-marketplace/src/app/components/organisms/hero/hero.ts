import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchBarHero } from '../../molecules/search-bar-hero/search-bar-hero';
import { ParametrosBusqueda } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SearchBarHero],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

  @Input() ciudades: string[] = [];

  @Output() search = new EventEmitter<ParametrosBusqueda>();

  onSearch(busqueda: ParametrosBusqueda): void {
    this.search.emit(busqueda);
  }
}
