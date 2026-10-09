import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'alojamientos',
    loadComponent: () => import('./pages/catalog/catalog.page').then(m => m.CatalogPage)
  },
  {
    path: 'alojamiento/:id',
    loadComponent: () => import('./pages/detail/detail.page').then(m => m.DetailPage)
  },
  {
    path: 'reservas',
    loadComponent: () => import('./pages/reservations/reservations.page').then(m => m.ReservationsPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];