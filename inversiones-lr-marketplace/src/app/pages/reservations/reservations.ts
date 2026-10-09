import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Label } from '../../components/atoms/label/label';
import { Button } from '../../components/atoms/button/button';
import { AlojamientoService } from '../../services/alojamiento';
import { Reserva } from '../../models/alojamiento.model';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [Label, Button],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class ReservationsPage implements OnInit {

  reservas: Reserva[] = [];

  constructor(
    private alojamientoService: AlojamientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservas = this.alojamientoService.getReservas();
  }

  eliminarReserva(id: string | number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.alojamientoService.eliminarReserva(id);
      this.cargarReservas();
    }
  }

  irACatalogo(): void {
    this.router.navigate(['/alojamientos']);
  }

  formatMoney(valor: number): string {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}