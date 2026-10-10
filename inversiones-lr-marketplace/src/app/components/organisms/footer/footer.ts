import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../atoms/logo/logo';

interface FooterLink {
  label: string;
  route?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  readonly anoActual: number = new Date().getFullYear();

  readonly columnas: FooterColumn[] = [
    {
      title: 'Nuestra empresa',
      links: [
        { label: 'Quiénes somos' },
        { label: 'Empleo' },
        { label: 'Móvil' },
        { label: 'Blog' },
        { label: 'Cómo funcionan nuestros servicios' },
      ],
    },
    {
      title: 'Contactar',
      links: [
        { label: 'Ayuda/Preguntas frecuentes' },
        { label: 'Prensa' },
        { label: 'Compañías afiliadas' },
        { label: 'Propietarios de hoteles' },
        { label: 'Socios' },
        { label: 'Anuncia con nosotros' },
      ],
    },
    {
      title: 'Explorar',
      links: [
        { label: 'Inicio', route: '/home' },
        { label: 'Alojamientos', route: '/alojamientos' },
        { label: 'Mis reservas', route: '/reservas' },
      ],
    },
  ];
}