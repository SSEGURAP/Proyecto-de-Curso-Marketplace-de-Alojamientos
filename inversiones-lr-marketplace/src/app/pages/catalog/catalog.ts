import { ChangeDetectorRef ,Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild(FilterSidebar) private filterSidebar?: FilterSidebar;

  alojamientos: Alojamiento[] = [];
  ciudades: string[] = [];
  tipos: string[] = [];
  precioLimite: number = 1000000;
  cargando: boolean = true;
  error: string = '';
  destino: string = '';
  ciudadBuscada: string = '';

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
          this.aplicarDestino();
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
        this.destino = params.get('destino') ?? '';
        this.aplicarDestino();
      });
  }

  private aplicarDestino(): void {
    if (!this.destino || this.ciudades.length === 0) {
      return;
    }

    const buscado = this.normalizar(this.destino);
    const ciudad = this.ciudades.find(c => this.normalizar(c).includes(buscado));

    if (ciudad) {
      this.ciudadBuscada = ciudad;
    } else {
      this.alojamientos = [];
    }
    this.cdr.markForCheck();
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  onFiltersChange(filtro: FiltroAlojamiento): void {
    this.filtro$.next(filtro);
  }

  limpiarFiltros(): void {
    this.filterSidebar?.clearFilters();
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/alojamiento', id]);
  }
}