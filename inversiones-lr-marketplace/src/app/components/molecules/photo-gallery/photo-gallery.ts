import { Component, Input } from '@angular/core';
import { Photo } from '../../atoms/photo/photo';

@Component({
  imports: [Photo],
  selector: 'app-photo-gallery',
  styleUrl: './photo-gallery.css',
  templateUrl: './photo-gallery.html',
})
export class PhotoGallery {
  @Input() images: string[] = [];
  @Input() alt: string = '';

  selectedIndex: number = 0;

  selectImage(index: number): void {
    this.selectedIndex = index;
  }
}
