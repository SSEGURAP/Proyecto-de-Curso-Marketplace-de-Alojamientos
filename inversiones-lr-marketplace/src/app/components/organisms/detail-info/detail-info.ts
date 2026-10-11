import { Component, Input, OnChanges } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';
import { Badge } from '../../atoms/badge/badge';
import { Alojamiento } from '../../../models/alojamiento.model';

interface ItemConIcono {
  icono: string;
  texto: string;
}

interface IconoPalabra {
  clave: string;
  icono: string;
}

const ICONOS_SERVICIO: IconoPalabra[] = [
  { clave: 'wi-fi', icono: 'wifi' },
  { clave: 'cocina', icono: 'kitchen' },
  { clave: 'tele', icono: 'tv' },
  { clave: 'lavadora', icono: 'local_laundry_service' },
  { clave: 'piscina', icono: 'pool' },
  { clave: 'aire', icono: 'ac_unit' },
  { clave: 'parqueadero', icono: 'local_parking' },
  { clave: 'bbq', icono: 'outdoor_grill' },
  { clave: 'chimenea', icono: 'fireplace' },
  { clave: 'gimnasio', icono: 'fitness_center' }
];

const ICONOS_REGLA: IconoPalabra[] = [
  { clave: 'fumar', icono: 'smoke_free' },
  { clave: 'fiesta', icono: 'music_off' },
  { clave: 'silencio', icono: 'volume_off' },
  { clave: 'mascota', icono: 'block' },
  { clave: 'huésped', icono: 'group' }
];

@Component({
  imports: [IconComponent, Badge],
  selector: 'app-detail-info',
  styleUrl: './detail-info.css',
  templateUrl: './detail-info.html',
})
export class DetailInfo implements OnChanges {
  @Input() alojamiento!: Alojamiento;

  especificaciones: ItemConIcono[] = [];
  servicios: ItemConIcono[] = [];
  reglas: ItemConIcono[] = [];

  ngOnChanges(): void {
    const a = this.alojamiento;

    this.especificaciones = [
      { icono: 'groups', texto: this.plural(a.capacidad, 'huésped', 'huéspedes') },
      { icono: 'meeting_room', texto: this.plural(a.habitaciones, 'habitación', 'habitaciones') },
      { icono: 'bed', texto: this.plural(a.camas, 'cama', 'camas') },
      { icono: 'bathtub', texto: this.plural(a.banos, 'baño', 'baños') }
    ];

    this.servicios = a.servicios.map(servicio => ({
      icono: this.buscarIcono(servicio, ICONOS_SERVICIO, 'check_circle_outline'),
      texto: servicio
    }));

    this.reglas = a.reglas.map(regla => ({
      icono: this.buscarIcono(regla, ICONOS_REGLA, 'info_outline'),
      texto: regla
    }));
  }

  private plural(cantidad: number, singular: string, plural: string): string {
    return cantidad + ' ' + (cantidad === 1 ? singular : plural);
  }

  private buscarIcono(texto: string, lista: IconoPalabra[], porDefecto: string): string {
    const minusculas = texto.toLowerCase();
    const encontrado = lista.find(item => minusculas.includes(item.clave));
    return encontrado ? encontrado.icono : porDefecto;
  }
}
