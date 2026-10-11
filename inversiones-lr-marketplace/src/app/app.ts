import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
export class App implements OnInit {

  ciudades: string[] = [];

  constructor(
    private router: Router,
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
    this.router.navigate(['/alojamientos'], {
      queryParams: this.alojamientoService.construirQueryParams(busqueda)
    });
  }
}
