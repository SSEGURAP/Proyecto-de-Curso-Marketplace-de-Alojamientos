import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { Label } from '../../components/atoms/label/label';
import { Button } from '../../components/atoms/button/button';
import { Badge } from '../../components/atoms/badge/badge';
import { IconComponent } from '../../components/atoms/icon/icon';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, Resena, Cotizacion, Reserva } from '../../models/alojamiento.model';
import { obtenerHoyLocal } from '../../utils/fecha.util';

interface ItemConIcono {
  icono: string;
  texto: string;
}

const ICONOS_SERVICIO: ReadonlyArray<[string, string]> = [
  ['wi-fi', 'wifi'],
  ['wifi', 'wifi'],
  ['cocina', 'kitchen'],
  ['tele', 'tv'],
  ['lavadora', 'local_laundry_service'],
  ['piscina', 'pool'],
  ['aire', 'ac_unit'],
  ['parqueadero', 'local_parking'],
  ['bbq', 'outdoor_grill'],
  ['chimenea', 'fireplace'],
  ['gimnasio', 'fitness_center']
];

const ICONOS_REGLA: ReadonlyArray<[string, string]> = [
  ['fumar', 'smoke_free'],
  ['fiesta', 'music_off'],
  ['silencio', 'volume_off'],
  ['mascota', 'block'],
  ['huesped', 'group']
];

const IMAGEN_RESPALDO: string = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
  '<rect width="100%" height="100%" fill="#E1E5EB"/>' +
  '<text x="50%" y="50%" fill="#5F6B7A" font-family="sans-serif" font-size="28" ' +
  'text-anchor="middle" dominant-baseline="middle">Imagen no disponible</text></svg>'
);

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [FormsModule, Label, Button, Badge, IconComponent],
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
  imagenesGaleria: string[] = [];
  especificaciones: ItemConIcono[] = [];
  servicios: ItemConIcono[] = [];
  reglas: ItemConIcono[] = [];
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
  readonly imagenRespaldo: string = IMAGEN_RESPALDO;

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
    this.imagenesGaleria = this.imagenes.slice(0, 5);
    this.opcionesHuespedes = Array.from({ length: a.capacidad }, (_, i) => i + 1);

    this.especificaciones = [
      { icono: 'groups', texto: this.plural(a.capacidad, 'huésped', 'huéspedes') },
      { icono: 'meeting_room', texto: this.plural(a.habitaciones, 'habitación', 'habitaciones') },
      { icono: 'bed', texto: this.plural(a.camas, 'cama', 'camas') },
      { icono: 'bathtub', texto: this.plural(a.banos, 'baño', 'baños') }
    ];

    this.servicios = a.servicios.map(s => ({
      icono: this.buscarIcono(s, ICONOS_SERVICIO, 'check_circle_outline'),
      texto: s
    }));

    this.reglas = a.reglas.map(r => ({
      icono: this.buscarIcono(r, ICONOS_REGLA, 'info_outline'),
      texto: r
    }));
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



  onLlegadaChange(): void {
    this.mensajeExito = '';
    if (this.fechaLlegada && this.fechaSalida && this.fechaSalida <= this.fechaLlegada) {
      this.fechaSalida = '';
    }
    this.calcularCotizacion();
  }

  onSalidaChange(): void {
    this.mensajeExito = '';
    this.calcularCotizacion();
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

  anterior(evento: Event): void {
    evento.stopPropagation();
    this.moverVisor(-1);
  }

  siguiente(evento: Event): void {
    evento.stopPropagation();
    this.moverVisor(1);
  }

  @HostListener('document:keydown', ['$event'])
  onTecla(evento: KeyboardEvent): void {
    if (!this.visorAbierto) {
      return;
    }
    if (evento.key === 'Escape') {
      this.cerrarVisor();
    } else if (evento.key === 'ArrowLeft') {
      this.moverVisor(-1);
    } else if (evento.key === 'ArrowRight') {
      this.moverVisor(1);
    }
  }

  onImagenError(evento: Event): void {
    const img = evento.target as HTMLImageElement;
    if (img.src !== IMAGEN_RESPALDO) {
      img.src = IMAGEN_RESPALDO;
    }
  }

  private moverVisor(delta: number): void {
    const total = this.imagenes.length;
    this.visorIndice = (this.visorIndice + delta + total) % total;
  }



  getUbicacion(alojamiento: Alojamiento): string {
    if (alojamiento.ubicacion.includes(alojamiento.ciudad)) {
      return alojamiento.ubicacion;
    }
    return alojamiento.ubicacion + ', ' + alojamiento.ciudad;
  }

  getEstrellas(calificacion: number): string {
    const llenas = Math.min(5, Math.max(0, Math.round(calificacion)));
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
  }

  getIniciales(nombre: string): string {
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(parte => parte.charAt(0).toUpperCase())
      .join('');
  }

  formatNumero(valor: number): string {
    return '$' + valor.toLocaleString('es-CO');
  }

  formatMoney(valor: number): string {
    return this.formatNumero(valor) + ' COP';
  }

  private plural(cantidad: number, singular: string, plural: string): string {
    return cantidad + ' ' + (cantidad === 1 ? singular : plural);
  }

  private buscarIcono(texto: string, tabla: ReadonlyArray<[string, string]>, porDefecto: string): string {
    const normalizado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const coincidencia = tabla.find(([clave]) => normalizado.includes(clave));
    return coincidencia ? coincidencia[1] : porDefecto;
  }

  private correoValido(correo: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
  }
}