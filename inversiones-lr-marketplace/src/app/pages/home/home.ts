import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../../components/organisms/hero/hero';
import { FeaturedAlojamientos } from '../../components/organisms/featured-alojamientos/featured-alojamientos';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Hero, FeaturedAlojamientos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {

  constructor(private router: Router) {}

  onSearch(data: { destination: string; checkIn: string; checkOut: string }): void {
      this.router.navigate(['/alojamientos'], {
      queryParams: { destino: data.destination.trim() || null }
    });
  }
}