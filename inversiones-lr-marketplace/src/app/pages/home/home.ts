import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../../components/organisms/hero/hero';
import { FeaturedAlojamientos } from '../../components/organisms/featured-alojamientos/featured-alojamientos';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, ParametrosBusqueda } from '../../models/alojamiento.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Hero, FeaturedAlojamientos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit {

  ciudades: string[] = [];
  alojamientosDestacados: Alojamiento[] = [];
  cargandoDestacados: boolean = true;

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

    this.cargarDestacados();
  }

  cargarDestacados(): void {
    this.cargandoDestacados = true;

    this.alojamientoService.getAlojamientos().subscribe({
      next: (data) => {
        this.alojamientosDestacados = data.slice(0, 3);
        this.cargandoDestacados = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar alojamientos destacados', err);
        this.cargandoDestacados = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSearch(busqueda: ParametrosBusqueda): void {
    this.router.navigate(['/alojamientos'], {
      queryParams: this.alojamientoService.construirQueryParams(busqueda)
    });
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/alojamiento', id]);
  }
}
