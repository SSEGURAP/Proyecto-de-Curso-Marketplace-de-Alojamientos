import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-label',
  styleUrl: './label.css',
  templateUrl: './label.html',
})
export class Label {
  @Input() text: string = '';
  @Input() variant: 'title' | 'field' | 'heading' | 'body' | 'muted' = 'field';
}
