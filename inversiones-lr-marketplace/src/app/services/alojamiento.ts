import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import {
  Alojamiento,
  Cotizacion,
  FiltroAlojamiento,
  MarketplaceData,
  Reserva,
  Resena
} from '../models/alojamiento.model';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {

  private http = inject(HttpClient);
  private readonly dataUrl = 'assets/data/marketplace-data.json';
  private readonly RESERVAS_KEY = 'lr_stays_reservas';
  private readonly TASA_SERVICIO = 0.10;
  private readonly MS_POR_DIA = 1000 * 60 * 60 * 24;

  /**
   * CACHE: el JSON se descarga UNA sola vez y se reutiliza en toda la app.
   * shareReplay(1) comparte la misma petición entre todos los suscriptores
   * y reemite el último valor a los que lleguen después.
   * Si la petición falla, se reinicia sola y el siguiente intento vuelve a pedirla.
   */
  private data$: Observable<MarketplaceData> = this.http
    .get<MarketplaceData>(this.dataUrl)
    .pipe(
      shareReplay({ bufferSize: 1, refCount: false }),
      catchError(err => {
        console.error('Error al cargar marketplace-data.json', err);
        return throwError(() => new Error('No se pudieron cargar los datos del marketplace.'));
      })
    );

  /** Regla de negocio: solo alojamientos activos (activo === true) */
  getAlojamientos(): Observable<Alojamiento[]> {
    return this.data$.pipe(
            map(data => data.alojamientos.filter(a => a.activo === true && a.precioNoche > 0))
    );
  }

  getAlojamientoById(id: number): Observable<Alojamiento | undefined> {
    return this.getAlojamientos().pipe(
      map(alojamientos => alojamientos.find(a => a.id === id))
    );
  }

  filtrarAlojamientos(filtro: FiltroAlojamiento): Observable<Alojamiento[]> {
    return this.getAlojamientos().pipe(
      map(alojamientos =>
        alojamientos.filter(a => {
          const cumpleCiudad = !filtro.ciudad || a.ciudad === filtro.ciudad;
          const cumpleHuespedes = !filtro.huespedes || a.capacidad >= filtro.huespedes;
          const cumpleTipo = !filtro.tipos || filtro.tipos.length === 0 || filtro.tipos.includes(a.tipo);
          const cumplePrecio = !filtro.precioMaximo || a.precioNoche <= filtro.precioMaximo;
          return cumpleCiudad && cumpleHuespedes && cumpleTipo && cumplePrecio;
        })
      )
    );
  }

  getResenasByAlojamiento(id: number): Observable<Resena[]> {
    return this.data$.pipe(
      map(data => data.resenas.filter(r => r.alojamientoId === id))
    );
  }

  getCiudades(): Observable<string[]> {
    return this.getAlojamientos().pipe(
      map(alojamientos => [...new Set(alojamientos.map(a => a.ciudad))].sort())
    );
  }

  getTipos(): Observable<string[]> {
    return this.getAlojamientos().pipe(
      map(alojamientos => [...new Set(alojamientos.map(a => a.tipo))].sort())
    );
  }

  /**
   * Regla: (Noches × PrecioNoche) + TarifaLimpieza + 10% de servicio sobre el subtotal.
   * Devuelve null si el rango de fechas no es válido (salida debe ser posterior a llegada).
   */
  calcularCotizacion(
    alojamiento: Alojamiento,
    fechaLlegada: string,
    fechaSalida: string,
    numeroHuespedes: number
  ): Cotizacion | null {
    // Se fuerza UTC para que la diferencia en días sea exacta (sin efecto de zona horaria)
    const llegada = new Date(fechaLlegada + 'T00:00:00Z');
    const salida = new Date(fechaSalida + 'T00:00:00Z');
    const numeroNoches = Math.round((salida.getTime() - llegada.getTime()) / this.MS_POR_DIA);

    if (isNaN(numeroNoches) || numeroNoches < 1) {
      return null;
    }

    const subtotal = numeroNoches * alojamiento.precioNoche;
    const tarifaLimpieza = alojamiento.tarifaLimpieza;
    const tarifaServicio = subtotal * this.TASA_SERVICIO;
    const total = subtotal + tarifaLimpieza + tarifaServicio;

    return {
      alojamientoId: alojamiento.id,
      fechaLlegada,
      fechaSalida,
      numeroHuespedes,
      numeroNoches,
      precioNoche: alojamiento.precioNoche,
      subtotal,
      tarifaLimpieza,
      tarifaServicio,
      total
    };
  }

  // ───────────── Persistencia de reservas (localStorage) ─────────────

  /** Devuelve true si se guardó correctamente */
  guardarReserva(reserva: Reserva): boolean {
    const reservas = this.getReservas();
    reservas.push(reserva);
    return this.persistir(reservas);
  }

  getReservas(): Reserva[] {
    try {
      const data = localStorage.getItem(this.RESERVAS_KEY);
      const parsed: unknown = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? (parsed as Reserva[]) : [];
    } catch (error) {
      console.error('No se pudieron leer las reservas guardadas', error);
      return [];
    }
  }

  getReservaById(id: string | number): Reserva | undefined {
    return this.getReservas().find(r => r.id === id);
  }

  eliminarReserva(id: string | number): void {
    this.persistir(this.getReservas().filter(r => r.id !== id));
  }

  generarIdReserva(): string {
    return 'RES-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  private persistir(reservas: Reserva[]): boolean {
    try {
      localStorage.setItem(this.RESERVAS_KEY, JSON.stringify(reservas));
      return true;
    } catch (error) {
      console.error('No se pudieron guardar las reservas', error);
      return false;
    }
  }
}