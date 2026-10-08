import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/atoms/logo/logo';
import { Icon } from './components/atoms/icon/icon';
import { Button } from './components/atoms/button/button';

@Component({
  imports: [RouterOutlet, Logo, Icon, Button],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('inversiones-lr-marketplace');
}
