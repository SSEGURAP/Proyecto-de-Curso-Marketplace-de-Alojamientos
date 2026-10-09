import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-icon',
  styleUrl: './icon.css',
  templateUrl: './icon.html',
})
export class Icon {
  @Input() name: string = '';
  @Input() size: string = '24px';
  @Input() color: string = 'currentColor';
}
