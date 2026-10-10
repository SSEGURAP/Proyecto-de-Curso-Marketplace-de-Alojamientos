import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/organisms/header/header';
import { Footer } from './components/organisms/footer/footer';
import { AlojamientoService } from './services/alojamiento';
import { ParametrosBusqueda } from './models/alojamiento.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(
    private router: Router,
    private alojamientoService: AlojamientoService
  ) {}

  /** Búsqueda lanzada desde la barra del Header -> catálogo con query params. */
  onSearch(busqueda: ParametrosBusqueda): void {
    this.router.navigate(['/alojamientos'], {
      queryParams: this.alojamientoService.construirQueryParams(busqueda)
    });
  }
}