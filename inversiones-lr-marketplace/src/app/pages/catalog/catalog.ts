import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError, debounceTime, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { Label } from '../../components/atoms/label/label';
import { FilterSidebar } from '../../components/organisms/filter-sidebar/filter-sidebar';
import { AlojamientoCard } from '../../components/organisms/alojamiento-card/alojamiento-card';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, FiltroAlojamiento } from '../../models/alojamiento.model';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [Label, FilterSidebar, AlojamientoCard, EmptyState],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class CatalogPage implements OnInit, OnDestroy {
  /** Referencia al sidebar para poder limpiar sus filtros desde el empty state */
  @ViewChild(FilterSidebar) private filterSidebar?: FilterSidebar;

  alojamientos: Alojamiento[] = [];
  ciudades: string[] = [];
  tipos: string[] = [];
  precioLimite: number = 1000000;
  cargando: boolean = true;
  error: string = '';

  private destroy$ = new Subject<void>();
  private filtro$ = new Subject<FiltroAlojamiento>();

  constructor(
    private alojamientoService: AlojamientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.escucharFiltros();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarDatosIniciales(): void {
    this.cargando = true;
    this.error = '';

    forkJoin({
      alojamientos: this.alojamientoService.getAlojamientos(),
      ciudades: this.alojamientoService.getCiudades(),
      tipos: this.alojamientoService.getTipos()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ alojamientos, ciudades, tipos }) => {
          this.alojamientos = alojamientos;
          this.ciudades = ciudades;
          this.tipos = tipos;
          if (alojamientos.length > 0) {
            this.precioLimite = Math.max(...alojamientos.map(a => a.precioNoche));
          }
          this.cargando = false;
        },
        error: (err: Error) => {
          this.error = err.message;
          this.cargando = false;
        }
      });
  }

  private escucharFiltros(): void {
    this.filtro$
      .pipe(
        debounceTime(150),
        switchMap(filtro =>
          this.alojamientoService.filtrarAlojamientos(filtro).pipe(
            catchError((err: Error) => {
              this.error = err.message;
              return of<Alojamiento[]>([]);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.alojamientos = data;
      });
  }

  onFiltersChange(filtro: FiltroAlojamiento): void {
    this.filtro$.next(filtro);
  }

  /**
   * Botón "Limpiar filtros" del empty state.
   * clearFilters() resetea los controles del sidebar y emite filtersChange,
   * así que el listado se recarga por el mismo flujo de siempre.
   */
  limpiarFiltros(): void {
    this.filterSidebar?.clearFilters();
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/alojamiento', id]);
  }
}