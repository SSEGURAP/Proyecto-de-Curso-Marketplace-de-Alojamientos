import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, debounceTime, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { Label } from '../../components/atoms/label/label';
import { Button } from '../../components/atoms/button/button';
import { FilterSidebar } from '../../components/organisms/filter-sidebar/filter-sidebar';
import { AlojamientoCard } from '../../components/organisms/alojamiento-card/alojamiento-card';
import { EmptyState } from '../../components/molecules/empty-state/empty-state';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, FiltroAlojamiento } from '../../models/alojamiento.model';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [Label, Button, FilterSidebar, AlojamientoCard, EmptyState],
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
  fechaLlegada: string = '';
  fechaSalida: string = '';
  errorFechas: string = '';

  private ultimoFiltro: FiltroAlojamiento = {};
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
          this.aplicarBusqueda();
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
        this.validarFechas(params.get('llegada') ?? '', params.get('salida') ?? '');
        this.aplicarBusqueda();
      });
  }

  private validarFechas(llegada: string, salida: string): void {
    this.fechaLlegada = '';
    this.fechaSalida = '';
    this.errorFechas = '';

    if (!llegada && !salida) {
      return;
    }

    if (!llegada || !salida) {
      this.errorFechas = 'Para buscar por fechas selecciona la llegada y la salida.';
    } else if (llegada < this.obtenerHoy()) {
      this.errorFechas = 'La fecha de llegada no puede ser anterior a la fecha actual.';
    } else if (salida <= llegada) {
      this.errorFechas = 'La fecha de salida debe ser posterior a la fecha de llegada.';
    } else {
      this.fechaLlegada = llegada;
      this.fechaSalida = salida;
    }
  }

  private aplicarBusqueda(): void {
    if (this.ciudades.length === 0) {
      return;
    }

    if (this.destino) {
      const buscado = this.normalizar(this.destino);
      const ciudad = this.ciudades.find(c => this.normalizar(c).includes(buscado));

      if (!ciudad) {
        this.alojamientos = [];
        this.cdr.markForCheck();
        return;
      }

      this.ciudadBuscada = ciudad;
      this.ultimoFiltro = { ...this.ultimoFiltro, ciudad: ciudad };
    }

    this.buscar();
  }

  private buscar(): void {
    this.filtro$.next({
      ...this.ultimoFiltro,
      fechaLlegada: this.fechaLlegada || undefined,
      fechaSalida: this.fechaSalida || undefined
    });
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private obtenerHoy(): string {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }

  private formatFecha(fecha: string): string {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getTextoFechas(): string {
    return 'Disponibles del ' + this.formatFecha(this.fechaLlegada) + ' al ' + this.formatFecha(this.fechaSalida);
  }

  quitarFechas(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { llegada: null, salida: null },
      queryParamsHandling: 'merge'
    });
  }

  onFiltersChange(filtro: FiltroAlojamiento): void {
    this.ultimoFiltro = filtro;
    this.buscar();
  }

  limpiarFiltros(): void {
    this.filterSidebar?.clearFilters();
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/alojamiento', id], {
      queryParams: {
        llegada: this.fechaLlegada || null,
        salida: this.fechaSalida || null
      }
    });
  }
}