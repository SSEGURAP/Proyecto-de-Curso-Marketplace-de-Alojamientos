import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, debounceTime, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { Label } from '../../components/atoms/label/label';
import { FilterSidebar } from '../../components/organisms/filter-sidebar/filter-sidebar';
import { AlojamientoCard } from '../../components/organisms/alojamiento-card/alojamiento-card';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, FiltroAlojamiento, ParametrosBusqueda } from '../../models/alojamiento.model';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [Label, FilterSidebar, AlojamientoCard, EmptyState],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class CatalogPage implements OnInit, OnDestroy {
  @ViewChild(FilterSidebar) private filterSidebar?: FilterSidebar;

  alojamientos: Alojamiento[] = [];
  ciudades: string[] = [];
  tipos: string[] = [];
  precioLimite: number = 1000000;
  cargando: boolean = true;
  error: string = '';

  busqueda: ParametrosBusqueda | null = null;
  resumenBusqueda: string = '';

  private filtroActual: FiltroAlojamiento | null = null;
  private destroy$ = new Subject<void>();
  private filtro$ = new Subject<FiltroAlojamiento>();

  constructor(
    private alojamientoService: AlojamientoService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.escucharFiltros();
    this.escucharBusqueda();
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

          if (this.filtroActual) {
            this.filtro$.next(this.filtroActual);
          }
          this.cdr.markForCheck();
        },
        error: (err: Error) => {
          this.error = err.message;
          this.cargando = false;
          this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      });
  }

  private escucharBusqueda(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.busqueda = this.alojamientoService.leerQueryParams(params);
        this.resumenBusqueda = this.construirResumen(this.busqueda);
        this.cdr.markForCheck();
      });
  }

  private construirResumen(busqueda: ParametrosBusqueda): string {
    if (!busqueda.llegada || !busqueda.salida) {
      return '';
    }
    const huespedes = busqueda.huespedes === 1 ? '1 huésped' : busqueda.huespedes + ' huéspedes';
    return `Estancia del ${this.formatFecha(busqueda.llegada)} al ${this.formatFecha(busqueda.salida)} · ${huespedes}`;
  }

  private formatFecha(fecha: string): string {
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  onFiltersChange(filtro: FiltroAlojamiento): void {
    this.filtroActual = filtro;
    this.filtro$.next(filtro);
  }

  limpiarFiltros(): void {
    this.filterSidebar?.clearFilters();
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  onViewDetail(id: number): void {
    const queryParams = this.alojamientoService.construirQueryParams({
      llegada: this.busqueda?.llegada,
      salida: this.busqueda?.salida,
      huespedes: this.filtroActual?.huespedes ?? this.busqueda?.huespedes ?? 1
    });
    this.router.navigate(['/alojamiento', id], { queryParams });
  }
}