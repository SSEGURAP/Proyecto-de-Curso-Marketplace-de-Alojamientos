import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Label } from '../../atoms/label/label';
import { AlojamientoCardCompressed } from '../alojamiento-card-compressed/alojamiento-card-compressed';
import { AlojamientoService } from '../../../services/alojamiento';
import { Alojamiento } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-featured-alojamientos',
  standalone: true,
  imports: [Label, AlojamientoCardCompressed, RouterLink],
  templateUrl: './featured-alojamientos.html',
  styleUrl: './featured-alojamientos.css',
})
export class FeaturedAlojamientos implements OnInit {

  alojamientosDestacados: Alojamiento[] = [];
  cargando: boolean = true;

  constructor(
    private alojamientoService: AlojamientoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDestacados();
  }

  cargarDestacados(): void {
    this.cargando = true;

    this.alojamientoService.getAlojamientos().subscribe({
      next: (data) => {
        this.alojamientosDestacados = data.slice(0, 3);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar alojamientos destacados', err);
        this.cargando = false;
      }
    });
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/alojamiento', id]);
  }

  explorarMas(): void {
    this.router.navigate(['/alojamientos']);
  }
}