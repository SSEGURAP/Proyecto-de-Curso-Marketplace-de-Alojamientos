import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-badge',
  styleUrl: './badge.css',
  templateUrl: './badge.html',
})
export class Badge {
  @Input() text: string = '';
  @Input() variant: 'overlay' | 'chip' = 'chip';
}
