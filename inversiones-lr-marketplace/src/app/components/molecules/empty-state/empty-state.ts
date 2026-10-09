import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Button } from '../../atoms/button/button';
import { Label } from '../../atoms/label/label';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [Button, Label],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {

  @Input() title: string = 'No se encontraron alojamientos con los filtros seleccionados';
  @Input() subtitle: string = 'Intenta ajustar tus filtros o buscar en otra ciudad';
  @Input() buttonLabel: string = 'Limpiar filtros';

  @Output() reset = new EventEmitter<void>();

  svgContent: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    // SVG simplificado y limpio basado en el archivo que enviaste
    const svg = `
      <svg width="220" height="180" viewBox="0 0 443 347" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M202.787 87.3044C212.406 87.3044 220.583 83.9566 227.317 77.2609C234.05 70.5653 237.417 62.4348 237.417 52.8696C237.417 43.3044 234.05 35.174 227.317 28.4783C220.583 21.7827 212.406 18.4348 202.787 18.4348C193.167 18.4348 184.991 21.7827 178.257 28.4783C171.523 35.174 168.156 43.3044 168.156 52.8696C168.156 62.4348 171.523 70.5653 178.257 77.2609C184.991 83.9566 193.167 87.3044 202.787 87.3044Z" fill="#1C1B1F"/>
        <path d="M280.513 140.87L232.03 92.6609C228.182 95.7218 223.757 98.145 218.755 99.9305C213.753 101.716 208.43 102.609 202.787 102.609C188.806 102.609 176.974 97.7943 167.291 88.1653C157.607 78.5363 152.765 66.7711 152.765 52.8696C152.765 38.9682 157.607 27.203 167.291 17.574C176.974 7.94499 188.806 3.13049 202.787 3.13049C216.767 3.13049 228.599 7.94499 238.283 17.574C247.967 27.203 252.809 38.9682 252.809 52.8696C252.809 58.4812 251.911 63.774 250.115 68.7479C248.319 73.7218 245.882 78.1218 242.804 81.9479L291.287 130.157L280.513 140.87Z" fill="#1C1B1F"/>
        <rect x="136.635" y="307" width="170" height="39" rx="9" stroke="#001745" stroke-width="2"/>
        <text x="221.5" y="332" text-anchor="middle" fill="#001745" font-family="Inter, sans-serif" font-size="14" font-weight="500">Filtros no coinciden</text>
      </svg>
    `;
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  onReset(): void {
    this.reset.emit();
  }
}