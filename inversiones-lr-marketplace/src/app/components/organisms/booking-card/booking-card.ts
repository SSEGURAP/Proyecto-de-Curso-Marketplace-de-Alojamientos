import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../atoms/button/button';
import { IconComponent } from '../../atoms/icon/icon';
import { Cotizacion } from '../../../models/alojamiento.model';

@Component({
  imports: [FormsModule, Button, IconComponent],
  selector: 'app-booking-card',
  styleUrl: './booking-card.css',
  templateUrl: './booking-card.html',
})
export class BookingCard {
  @Input() precioNoche: number = 0;
  @Input() hoy: string = '';
  @Input() fechaLlegada: string = '';
  @Input() fechaSalida: string = '';
  @Input() numeroHuespedes: number = 1;
  @Input() opcionesHuespedes: number[] = [];
  @Input() nombreHuesped: string = '';
  @Input() correoHuesped: string = '';
  @Input() cotizacion: Cotizacion | null = null;
  @Input() errorFormulario: string = '';
  @Input() confirmando: boolean = false;

  @Output() fechaLlegadaChange = new EventEmitter<string>();
  @Output() fechaSalidaChange = new EventEmitter<string>();
  @Output() numeroHuespedesChange = new EventEmitter<number>();
  @Output() nombreHuespedChange = new EventEmitter<string>();
  @Output() correoHuespedChange = new EventEmitter<string>();
  @Output() iniciarReserva = new EventEmitter<void>();
  @Output() confirmarReserva = new EventEmitter<void>();
  @Output() cancelarReserva = new EventEmitter<void>();

  onLlegadaChange(valor: string): void {
    this.fechaLlegadaChange.emit(valor);
  }

  onSalidaChange(valor: string): void {
    this.fechaSalidaChange.emit(valor);
  }

  onHuespedesChange(valor: number): void {
    this.numeroHuespedesChange.emit(valor);
  }

  onNombreChange(valor: string): void {
    this.nombreHuespedChange.emit(valor);
  }

  onCorreoChange(valor: string): void {
    this.correoHuespedChange.emit(valor);
  }

  onReservar(): void {
    this.iniciarReserva.emit();
  }

  onConfirmar(): void {
    this.confirmarReserva.emit();
  }

  onCancelar(): void {
    this.cancelarReserva.emit();
  }

  formatNumero(valor: number): string {
    return '$' + valor.toLocaleString('es-CO');
  }

  formatMoney(valor: number): string {
    return this.formatNumero(valor) + ' COP';
  }
}
