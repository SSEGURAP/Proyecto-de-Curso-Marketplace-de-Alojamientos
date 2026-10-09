import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Label } from '../../components/atoms/label/label';
import { FilterSidebar } from '../../components/organisms/filter-sidebar/filter-sidebar';
import { AlojamientoCard } from '../../components/organisms/alojamiento-card/alojamiento-card';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, FiltroAlojamiento } from '../../models/alojamiento.model';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [Label, FilterSidebar, AlojamientoCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class CatalogPage implements OnInit {

  alojamientos: Alojamiento[] = [];
  ciudades: string[] = [];
  tipos: string[] = [];
  precioLimite: number = 1000000;
  cargando: boolean = true;

  constructor(
    private alojamientoService: AlojamientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.cargando = true;

    this.alojamientoService.getAlojamientos().subscribe({
      next: (data) => {
        this.alojamientos = data;
        this.cargando = false;

        if (data.length > 0) {
          this.precioLimite = Math.max(...data.map(a => a.precioNoche));
        }
      },
      error: (err) => {
        console.error('Error al cargar alojamientos', err);
        this.cargando = false;
      }
    });

    this.alojamientoService.getCiudades().subscribe(ciudades => {
      this.ciudades = ciudades;
    });

    this.alojamientoService.getTipos().subscribe(tipos => {
      this.tipos = tipos;
    });
  }

  onFiltersChange(filtro: FiltroAlojamiento): void {
    this.cargando = true;

    this.alojamientoService.filtrarAlojamientos(filtro).subscribe({
      next: (data) => {
        this.alojamientos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al filtrar', err);
        this.cargando = false;
      }
    });
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/alojamiento', id]);
  }
}