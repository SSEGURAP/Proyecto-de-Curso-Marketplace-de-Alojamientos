import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { Label } from '../../components/atoms/label/label';
import { Button } from '../../components/atoms/button/button';
import { ServiceList } from '../../components/molecules/service-list/service-list';
import { PriceTag } from '../../components/molecules/price-tag/price-tag';
import { CounterField } from '../../components/molecules/counter-field/counter-field';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, Resena, Cotizacion, Reserva } from '../../models/alojamiento.model';
import { PhotoGallery } from '../../components/molecules/photo-gallery/photo-gallery';
import { Badge } from '../../components/atoms/badge/badge';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [
    FormsModule,
    Label,
    Button,
    Badge,
    PhotoGallery,
    ServiceList,
    PriceTag,
    CounterField
  ],
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

  fechaLlegada: string = '';
  fechaSalida: string = '';
  numeroHuespedes: number = 1;
  nombreHuesped: string = '';
  correoHuesped: string = '';

  hoy: string = this.obtenerHoyLocal();

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
            this.numeroHuespedes = 1;
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

  calcularCotizacion(): void {
    this.errorFormulario = '';

    if (!this.alojamiento || !this.fechaLlegada || !this.fechaSalida) {
      this.cotizacion = null;
      return;
    }

    if (this.fechaLlegada < this.hoy) {
      this.cotizacion = null;
      this.errorFormulario = 'La fecha de llegada no puede ser anterior a la fecha actual.';
      return;
    }

    this.cotizacion = this.alojamientoService.calcularCotizacion(
      this.alojamiento,
      this.fechaLlegada,
      this.fechaSalida,
      this.numeroHuespedes
    );

    if (!this.cotizacion) {
      this.errorFormulario = 'La fecha de salida debe ser posterior a la fecha de llegada.';
    }
  }

  onFechasChange(): void {
    this.mensajeExito = '';
    this.calcularCotizacion();
  }

  onHuespedesChange(valor: number): void {
    this.numeroHuespedes = valor;
    this.calcularCotizacion();
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
  }

  volver(): void {
    this.router.navigate(['/alojamientos']);
  }

  irAReservas(): void {
    this.router.navigate(['/reservas']);
  }

  getUbicacion(alojamiento: Alojamiento): string {
    if (alojamiento.ubicacion.includes(alojamiento.ciudad)) {
      return alojamiento.ubicacion;
    }
    return alojamiento.ubicacion + ', ' + alojamiento.ciudad;
  }

  getCaracteristicas(alojamiento: Alojamiento): string {
    return alojamiento.tipo + ' · ' +
      alojamiento.capacidad + ' huéspedes · ' +
      alojamiento.habitaciones + ' habitaciones · ' +
      alojamiento.camas + ' camas · ' +
      alojamiento.banos + ' baños';
  }

  getCalificacion(alojamiento: Alojamiento): string {
    return alojamiento.calificacion + ' ★ · ' + this.resenas.length + ' reseña(s)';
  }

  formatMoney(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }

  private correoValido(correo: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
  }

  private obtenerHoyLocal(): string {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}