import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.HomePage)
  },
  {
    path: 'alojamientos',
    loadComponent: () => import('./pages/catalog/catalog').then(m => m.CatalogPage)
  },
  {
    path: 'alojamiento/:id',
    loadComponent: () => import('./pages/detail/detail').then(m => m.DetailPage)
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/reservations/reservations').then(m => m.ReservationsPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];