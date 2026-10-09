import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/atoms/logo/logo';
import { IconComponent } from './components/atoms/icon/icon';
import { Button } from './components/atoms/button/button';
import { InputComponent } from './components/atoms/input/input';
import { LinkComponent } from './components/atoms/link/link';
import { SearchBar } from './components/molecules/search-bar/search-bar';
import { Header } from './components/organisms/header/header';

@Component({
  imports: [RouterOutlet, Logo, IconComponent, Button, InputComponent, LinkComponent, SearchBar, Header],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
onSearch(data: { destination: string; checkIn: string; checkOut: string }): void {
  console.log('Búsqueda:', data);
}
 destino: string = '';
}
