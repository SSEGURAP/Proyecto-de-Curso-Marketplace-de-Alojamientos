import { Component, EventEmitter, Output } from '@angular/core';
import { SearchBarHero } from '../../molecules/search-bar-hero/search-bar-hero';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SearchBarHero],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {

  destination = '';
  checkIn = '';
  checkOut = '';

  @Output() search = new EventEmitter<{
    destination: string;
    checkIn: string;
    checkOut: string;
  }>();

  onSearch(): void {
    this.search.emit({
      destination: this.destination,
      checkIn: this.checkIn,
      checkOut: this.checkOut
    });
  }
}