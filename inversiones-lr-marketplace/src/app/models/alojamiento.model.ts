export interface Alojamiento {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
  ubicacion: string;
  tipo: string;
  capacidad: number;
  habitaciones: number;
  camas: number;
  banos: number;
  precioNoche: number;
  tarifaLimpieza: number;
  calificacion: number;
  activo: boolean;
  imagenPrincipal: string;
  imagenes: string[];
  servicios: string[];
  reglas: string[];
}

export interface Resena {
  id: number;
  alojamientoId: number;
  usuario: string;
  calificacion: number;
  comentario: string;
}

export interface Cotizacion {
  alojamientoId: number;
  fechaLlegada: string;
  fechaSalida: string;
  numeroHuespedes: number;
  numeroNoches: number;
  precioNoche: number;
  subtotal: number;
  tarifaLimpieza: number;
  tarifaServicio: number;
  total: number;
}

export interface Reserva {
  id: string | number;
  alojamientoId: number;
  alojamientoNombre: string;
  ciudad: string;
  fechaLlegada: string;
  fechaSalida: string;
  numeroHuespedes: number;
  numeroNoches: number;
  valorTotal: number;
  nombreHuesped: string;
  correoHuesped: string;
  estado: 'CONFIRMADA';
}

export interface FiltroAlojamiento {
  ciudad?: string;
  huespedes?: number;
  tipos?: string[];
  precioMaximo?: number;
}