import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { Label } from '../../components/atoms/label/label';
import { Button } from '../../components/atoms/button/button';
import { IconComponent } from '../../components/atoms/icon/icon';
import { DetailGallery } from '../../components/organisms/detail-gallery/detail-gallery';
import { DetailInfo } from '../../components/organisms/detail-info/detail-info';
import { ReviewList } from '../../components/organisms/review-list/review-list';
import { BookingCard } from '../../components/organisms/booking-card/booking-card';
import { PhotoViewer } from '../../components/organisms/photo-viewer/photo-viewer';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, Resena, Cotizacion, Reserva } from '../../models/alojamiento.model';
import { obtenerHoyLocal } from '../../utils/fecha.util';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [Label, Button, IconComponent, DetailGallery, DetailInfo, ReviewList, BookingCard, PhotoViewer],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class DetailPage implements OnInit, OnDestroy {
  alojamiento: Alojamiento | null = null;
  resenas: Resena[] = [];
  cotizacion: Cotizacion | null = null;
  cargando: boolean = true;
  error: string = '';
  errorFormulario: string = '';
  mensajeExito: string = '';

  imagenes: string[] = [];
  opcionesHuespedes: number[] = [];

  fechaLlegada: string = '';
  fechaSalida: string = '';
  numeroHuespedes: number = 1;
  nombreHuesped: string = '';
  correoHuesped: string = '';
  confirmando: boolean = false;

  visorAbierto: boolean = false;
  visorIndice: number = 0;

  readonly hoy: string = obtenerHoyLocal();

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alojamientoService: AlojamientoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!Number.isInteger(id) || id <= 0) {
      this.error = 'ID de alojamiento inválido';
      this.cargando = false;
      return;
    }

    this.cargarAlojamiento(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarAlojamiento(id: number): void {
    this.cargando = true;

    forkJoin({
      alojamiento: this.alojamientoService.getAlojamientoById(id),
      resenas: this.alojamientoService.getResenasByAlojamiento(id).pipe(
        catchError(() => of<Resena[]>([]))
      )
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ alojamiento, resenas }) => {
          if (!alojamiento) {
            this.error = 'Alojamiento no encontrado';
          } else {
            this.alojamiento = alojamiento;
            this.resenas = resenas;
            this.prepararVista(alojamiento);
            this.aplicarBusquedaInicial(alojamiento);
          }
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (err: Error) => {
          console.error(err);
          this.error = 'Error al cargar el alojamiento';
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
  }

  private prepararVista(a: Alojamiento): void {
    this.imagenes = a.imagenes && a.imagenes.length > 0 ? a.imagenes : [a.imagenPrincipal];
    this.opcionesHuespedes = Array.from({ length: a.capacidad }, (_, i) => i + 1);
  }

  private aplicarBusquedaInicial(a: Alojamiento): void {
    const busqueda = this.alojamientoService.leerQueryParams(this.route.snapshot.queryParamMap);

    this.fechaLlegada = busqueda.llegada;
    this.fechaSalida = busqueda.salida;
    this.numeroHuespedes = Math.min(Math.max(busqueda.huespedes, 1), a.capacidad);

    if (this.fechaLlegada && this.fechaSalida) {
      this.calcularCotizacion();
    }
  }

  onLlegadaChange(valor: string): void {
    this.fechaLlegada = valor;
    this.mensajeExito = '';
    if (this.fechaLlegada && this.fechaSalida && this.fechaSalida <= this.fechaLlegada) {
      this.fechaSalida = '';
    }
    this.calcularCotizacion();
  }

  onSalidaChange(valor: string): void {
    this.fechaSalida = valor;
    this.mensajeExito = '';
    this.calcularCotizacion();
  }

  onHuespedesChange(valor: number): void {
    this.numeroHuespedes = valor;
    this.calcularCotizacion();
  }

  onNombreChange(valor: string): void {
    this.nombreHuesped = valor;
  }

  onCorreoChange(valor: string): void {
    this.correoHuesped = valor;
  }

  calcularCotizacion(): void {
    this.errorFormulario = '';

    if (!this.alojamiento || !this.fechaLlegada || !this.fechaSalida) {
      this.invalidarCotizacion('');
      return;
    }

    if (this.fechaLlegada < this.hoy) {
      this.invalidarCotizacion('La fecha de llegada no puede ser anterior a la fecha actual.');
      return;
    }

    if (this.numeroHuespedes < 1 || this.numeroHuespedes > this.alojamiento.capacidad) {
      this.invalidarCotizacion(`El número de huéspedes debe estar entre 1 y ${this.alojamiento.capacidad}.`);
      return;
    }

    const cotizacion = this.alojamientoService.calcularCotizacion(
      this.alojamiento,
      this.fechaLlegada,
      this.fechaSalida,
      this.numeroHuespedes
    );

    if (!cotizacion) {
      this.invalidarCotizacion('La fecha de salida debe ser posterior a la fecha de llegada.');
      return;
    }

    this.cotizacion = cotizacion;
  }

  private invalidarCotizacion(mensaje: string): void {
    this.cotizacion = null;
    this.confirmando = false;
    this.errorFormulario = mensaje;
  }

  iniciarReserva(): void {
    if (!this.cotizacion) {
      return;
    }
    this.errorFormulario = '';
    this.confirmando = true;
  }

  cancelarReserva(): void {
    this.errorFormulario = '';
    this.confirmando = false;
  }

  reservar(): void {
    if (!this.alojamiento || !this.cotizacion) {
      return;
    }

    if (!this.nombreHuesped.trim() || !this.correoHuesped.trim()) {
      this.errorFormulario = 'Por favor completa nombre y correo.';
      return;
    }

    if (!this.correoValido(this.correoHuesped)) {
      this.errorFormulario = 'Ingresa un correo electrónico válido.';
      return;
    }

    const reserva: Reserva = {
      id: this.alojamientoService.generarIdReserva(),
      alojamientoId: this.alojamiento.id,
      alojamientoNombre: this.alojamiento.nombre,
      ciudad: this.alojamiento.ciudad,
      fechaLlegada: this.fechaLlegada,
      fechaSalida: this.fechaSalida,
      numeroHuespedes: this.numeroHuespedes,
      numeroNoches: this.cotizacion.numeroNoches,
      valorTotal: this.cotizacion.total,
      nombreHuesped: this.nombreHuesped.trim(),
      correoHuesped: this.correoHuesped.trim(),
      estado: 'CONFIRMADA'
    };

    const guardada = this.alojamientoService.guardarReserva(reserva);

    if (!guardada) {
      this.errorFormulario = 'No se pudo guardar la reserva en este navegador. Intenta de nuevo.';
      return;
    }

    this.errorFormulario = '';
    this.mensajeExito = `¡Reserva confirmada! ID: ${reserva.id}`;

    this.fechaLlegada = '';
    this.fechaSalida = '';
    this.nombreHuesped = '';
    this.correoHuesped = '';
    this.cotizacion = null;
    this.confirmando = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volver(): void {
    this.router.navigate(['/alojamientos']);
  }

  irAReservas(): void {
    this.router.navigate(['/reservas']);
  }

  irAResenas(): void {
    document.getElementById('resenas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  abrirVisor(indice: number): void {
    this.visorIndice = indice;
    this.visorAbierto = true;
  }

  cerrarVisor(): void {
    this.visorAbierto = false;
  }

  getUbicacion(alojamiento: Alojamiento): string {
    if (alojamiento.ubicacion.includes(alojamiento.ciudad)) {
      return alojamiento.ubicacion;
    }
    return alojamiento.ubicacion + ', ' + alojamiento.ciudad;
  }

  private correoValido(correo: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
  }
}
