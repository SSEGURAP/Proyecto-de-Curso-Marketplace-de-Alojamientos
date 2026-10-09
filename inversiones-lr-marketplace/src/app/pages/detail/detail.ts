import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Label } from '../../components/atoms/label/label';
import { Button } from '../../components/atoms/button/button';
import { Photo } from '../../components/atoms/photo/photo';
import { InputComponent } from '../../components/atoms/input/input';
import { ServiceList } from '../../components/molecules/service-list/service-list';
import { PriceTag } from '../../components/molecules/price-tag/price-tag';
import { CounterField } from '../../components/molecules/counter-field/counter-field';
import { AlojamientoService } from '../../services/alojamiento';
import { Alojamiento, Resena, Cotizacion, Reserva } from '../../models/alojamiento.model';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [
    FormsModule,
    Label,
    Button,
    Photo,
    InputComponent,
    ServiceList,
    PriceTag,
    CounterField
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class DetailPage implements OnInit {

  alojamiento: Alojamiento | null = null;
  resenas: Resena[] = [];
  cotizacion: Cotizacion | null = null;
  cargando: boolean = true;
  error: string = '';
  mensajeExito: string = '';

  // Formulario
  fechaLlegada: string = '';
  fechaSalida: string = '';
  numeroHuespedes: number = 1;
  nombreHuesped: string = '';
  correoHuesped: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alojamientoService: AlojamientoService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id || isNaN(id)) {
      this.error = 'ID de alojamiento inválido';
      this.cargando = false;
      return;
    }

    this.cargarAlojamiento(id);
  }

  cargarAlojamiento(id: number): void {
    this.cargando = true;

    this.alojamientoService.getAlojamientoById(id).subscribe({
      next: (data) => {
        if (!data) {
          this.error = 'Alojamiento no encontrado';
          this.cargando = false;
          return;
        }
        this.alojamiento = data;
        this.numeroHuespedes = 1;
        this.cargarResenas(id);
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar el alojamiento';
        this.cargando = false;
      }
    });
  }

  cargarResenas(id: number): void {
    this.alojamientoService.getResenasByAlojamiento(id).subscribe({
      next: (data) => {
        this.resenas = data;
      }
    });
  }

  calcularCotizacion(): void {
    if (!this.alojamiento || !this.fechaLlegada || !this.fechaSalida) {
      this.cotizacion = null;
      return;
    }

    this.cotizacion = this.alojamientoService.calcularCotizacion(
      this.alojamiento,
      this.fechaLlegada,
      this.fechaSalida,
      this.numeroHuespedes
    );
  }

  onFechasChange(): void {
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
      alert('Por favor completa nombre y correo');
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

    this.alojamientoService.guardarReserva(reserva);
    this.mensajeExito = `¡Reserva confirmada! ID: ${reserva.id}`;
    
    // Limpiar formulario
    this.fechaLlegada = '';
    this.fechaSalida = '';
    this.nombreHuesped = '';
    this.correoHuesped = '';
    this.cotizacion = null;
  }

  volver(): void {
    this.router.navigate(['/alojamientos']);
  }

  formatMoney(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }
}