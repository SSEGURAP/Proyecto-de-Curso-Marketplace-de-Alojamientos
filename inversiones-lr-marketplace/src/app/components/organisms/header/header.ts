import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBar } from '../../molecules/search-bar/search-bar';
import { Logo } from '../../atoms/logo/logo';
import { LinkComponent } from '../../atoms/link/link';
import { ParametrosBusqueda } from '../../../models/alojamiento.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBar, Logo, LinkComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Input() ciudades: string[] = [];

  @Output() search = new EventEmitter<ParametrosBusqueda>();

  constructor(private router: Router) {}

  onSearch(busqueda: ParametrosBusqueda): void {
    this.search.emit(busqueda);
  }

  irAHome(): void {
    this.router.navigate(['/home']);
  }
}
