import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [Button],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  @Input() title: string = 'No se encontraron alojamientos con los filtros seleccionados.';
  @Input() subtitle: string = 'Intenta ajustar tus filtros o busca en otra ciudad';
  @Input() buttonLabel: string = 'Limpiar filtros';

  @Output() resetFilters = new EventEmitter<void>();

  onReset(): void {
    this.resetFilters.emit();
  }
}