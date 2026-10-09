import { Component, Input } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';
import { Photo } from '../../atoms/photo/photo';

@Component({
  imports: [Photo, Badge],
  selector: 'app-photo-rating',
  styleUrl: './photo-rating.css',
  templateUrl: './photo-rating.html',
})
export class PhotoRating {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() rating: number = 0;
}
