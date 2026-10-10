import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../../components/organisms/hero/hero';
import { FeaturedAlojamientos } from '../../components/organisms/featured-alojamientos/featured-alojamientos';
import { AlojamientoService } from '../../services/alojamiento';
import { ParametrosBusqueda } from '../../models/alojamiento.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Hero, FeaturedAlojamientos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {

  constructor(
    private router: Router,
    private alojamientoService: AlojamientoService
  ) {}

  /** Búsqueda lanzada desde el Hero -> catálogo con query params. */
  onSearch(busqueda: ParametrosBusqueda): void {
    this.router.navigate(['/alojamientos'], {
      queryParams: this.alojamientoService.construirQueryParams(busqueda)
    });
  }
}