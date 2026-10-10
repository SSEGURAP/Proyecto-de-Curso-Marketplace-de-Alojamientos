import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBar } from '../../molecules/search-bar/search-bar';
import { Logo } from '../../atoms/logo/logo';
import { LinkComponent } from '../../atoms/link/link';
import { AlojamientoService } from '../../../services/alojamiento';
import { ParametrosBusqueda } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBar, Logo, LinkComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  ciudades: string[] = [];

  @Output() search = new EventEmitter<ParametrosBusqueda>();

  constructor(
    private router: Router,
    private alojamientoService: AlojamientoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.alojamientoService.getCiudades().subscribe({
      next: ciudades => {
        this.ciudades = ciudades;
        this.cdr.markForCheck();
      },
      error: err => console.error('No se pudieron cargar las ciudades del buscador', err)
    });
  }

  onSearch(busqueda: ParametrosBusqueda): void {
    this.search.emit(busqueda);
  }

  irAHome(): void {
    this.router.navigate(['/home']);
  }
}