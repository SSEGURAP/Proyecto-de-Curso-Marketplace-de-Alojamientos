import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-photo',
  styleUrl: './photo.css',
  templateUrl: './photo.html',
})
export class Photo {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() loading: 'lazy' | 'eager' = 'lazy';
}