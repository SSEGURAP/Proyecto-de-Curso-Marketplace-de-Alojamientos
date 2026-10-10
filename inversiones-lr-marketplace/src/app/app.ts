import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/organisms/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  onSearch(data: { destination: string; checkIn: string; checkOut: string }): void {
    console.log('Búsqueda desde header:', data);
  }
}