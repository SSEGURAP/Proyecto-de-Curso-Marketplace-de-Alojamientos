import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Alojamiento, Resena, FiltroAlojamiento, Cotizacion, Reserva } from '../models/alojamiento.model';

@Injectable({
    providedIn: 'root'
})
export class AlojamientoService {

    private http = inject(HttpClient);
    private dataUrl = 'assets/data/marketplace-data.json';

    /**
     * Obtiene todos los alojamientos activos
     */
    getAlojamientos(): Observable<Alojamiento[]> {
        return this.http.get<{ alojamientos: Alojamiento[] }>(this.dataUrl).pipe(
            map(response => response.alojamientos.filter(a => a.activo === true))
        );
    }

    /**
     * Obtiene un alojamiento por su ID (solo si está activo)
     */
    getAlojamientoById(id: number): Observable<Alojamiento | undefined> {
        return this.getAlojamientos().pipe(
            map(alojamientos => alojamientos.find(a => a.id === id))
        );
    }

    /**
     * Filtra alojamientos según los criterios del usuario
     */
    filtrarAlojamientos(filtro: FiltroAlojamiento): Observable<Alojamiento[]> {
        return this.getAlojamientos().pipe(
            map(alojamientos => {
                return alojamientos.filter(a => {
                    const cumpleCiudad = !filtro.ciudad || a.ciudad === filtro.ciudad;
                    const cumpleHuespedes = !filtro.huespedes || a.capacidad >= filtro.huespedes;
                    const cumpleTipo = !filtro.tipos || filtro.tipos.length === 0 || filtro.tipos.includes(a.tipo);
                    const cumplePrecio = !filtro.precioMaximo || a.precioNoche <= filtro.precioMaximo;

                    return cumpleCiudad && cumpleHuespedes && cumpleTipo && cumplePrecio;
                });
            })
        );
    }

    /**
     * Obtiene las reseñas de un alojamiento
     */
    getResenasByAlojamiento(id: number): Observable<Resena[]> {
        return this.http.get<{ resenas: Resena[] }>(this.dataUrl).pipe(
            map(response => response.resenas.filter(r => r.alojamientoId === id))
        );
    }

    /**
     * Obtiene la lista de ciudades únicas (para el filtro)
     */
    getCiudades(): Observable<string[]> {
        return this.getAlojamientos().pipe(
            map(alojamientos => {
                const ciudades = alojamientos.map(a => a.ciudad);
                return [...new Set(ciudades)].sort();
            })
        );
    }

    /**
     * Obtiene la lista de tipos únicos (para el filtro)
     */
    getTipos(): Observable<string[]> {
        return this.getAlojamientos().pipe(
            map(alojamientos => {
                const tipos = alojamientos.map(a => a.tipo);
                return [...new Set(tipos)].sort();
            })
        );
    }

    /**
   * Calcula la cotización de un alojamiento
   * Regla: (Noches × PrecioNoche) + TarifaLimpieza + 10% de servicio sobre el subtotal
   */
    calcularCotizacion(
        alojamiento: Alojamiento,
        fechaLlegada: string,
        fechaSalida: string,
        numeroHuespedes: number
    ): Cotizacion {
        const llegada = new Date(fechaLlegada);
        const salida = new Date(fechaSalida);

        // Calculamos el número de noches
        const diferenciaMs = salida.getTime() - llegada.getTime();
        const numeroNoches = Math.max(1, Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)));

        const subtotal = numeroNoches * alojamiento.precioNoche;
        const tarifaLimpieza = alojamiento.tarifaLimpieza;
        const tarifaServicio = subtotal * 0.10; // 10% sobre el subtotal
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


    private readonly RESERVAS_KEY = 'lr_stays_reservas';

    /**
     * Guarda una nueva reserva en localStorage
     */
    guardarReserva(reserva: Reserva): void {
        const reservas = this.getReservas();
        reservas.push(reserva);
        localStorage.setItem(this.RESERVAS_KEY, JSON.stringify(reservas));
    }

    /**
     * Obtiene todas las reservas guardadas
     */
    getReservas(): Reserva[] {
        const data = localStorage.getItem(this.RESERVAS_KEY);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Obtiene una reserva por su ID
     */
    getReservaById(id: string | number): Reserva | undefined {
        return this.getReservas().find(r => r.id === id);
    }

    /**
     * Elimina una reserva por su ID
     */
    eliminarReserva(id: string | number): void {
        const reservas = this.getReservas().filter(r => r.id !== id);
        localStorage.setItem(this.RESERVAS_KEY, JSON.stringify(reservas));
    }

    /**
     * Genera un ID único simple para la reserva
     */
    generarIdReserva(): string {
        return 'RES-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

}