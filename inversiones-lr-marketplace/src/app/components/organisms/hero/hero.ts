import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchBarHero } from '../../molecules/search-bar-hero/search-bar-hero';
import { AlojamientoService } from '../../../services/alojamiento';
import { ParametrosBusqueda } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SearchBarHero],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit {

  ciudades: string[] = [];

  @Output() search = new EventEmitter<ParametrosBusqueda>();

  constructor(
    private alojamientoService: AlojamientoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.alojamientoService.getCiudades().subscribe({
      next: ciudades => {
        this.ciudades = ciudades;
        this.cdr.markForCheck();
      },
      error: err => console.error('No se pudieron cargar las ciudades del buscador', err)
    });
  }

  onSearch(busqueda: ParametrosBusqueda): void {
    this.search.emit(busqueda);
  }
}