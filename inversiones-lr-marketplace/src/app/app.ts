import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/organisms/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  constructor(private router: Router) {}

  onSearch(data: { destination: string; checkIn: string; checkOut: string }): void {
    this.router.navigate(['/alojamientos'], {
      queryParams: { destino: data.destination.trim() || null }
    });
  }
}