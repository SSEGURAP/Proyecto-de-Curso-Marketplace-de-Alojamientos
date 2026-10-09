import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/atoms/logo/logo';
import { Icon } from './components/atoms/icon/icon';
import { Button } from './components/atoms/button/button';
import { InputComponent } from './components/atoms/input/input';
import { LinkComponent } from './components/atoms/link/link';

@Component({
  imports: [RouterOutlet, Logo, Icon, Button, InputComponent, LinkComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
 destino: string = '';
}
