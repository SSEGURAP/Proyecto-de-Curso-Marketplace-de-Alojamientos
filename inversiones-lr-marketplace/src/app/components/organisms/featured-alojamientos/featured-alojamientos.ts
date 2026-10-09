import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Label } from '../../atoms/label/label';
import { Button } from '../../atoms/button/button';
import { AlojamientoCardCompressed } from '../alojamiento-card-compressed/alojamiento-card-compressed';
import { AlojamientoService } from '../../../services/alojamiento';
import { Alojamiento } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-featured-alojamientos',
  standalone: true,
  imports: [Label, Button, AlojamientoCardCompressed],
  templateUrl: './featured-alojamientos.html',
  styleUrl: './featured-alojamientos.css',
})
export class FeaturedAlojamientos implements OnInit {

  destacados: Alojamiento[] = [];
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
        // Ordenamos por calificación descendente y tomamos los 3 mejores
        this.destacados = [...data]
          .sort((a, b) => b.calificacion - a.calificacion)
          .slice(0, 3);

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar destacados', err);
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