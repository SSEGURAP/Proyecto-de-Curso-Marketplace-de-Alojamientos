import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputComponent } from '../../atoms/input/input';

@Component({
  selector: 'app-search-bar-hero',
  standalone: true,
  imports: [ InputComponent],
  templateUrl: './search-bar-hero.html',
  styleUrl: './search-bar-hero.css',
})
export class SearchBarHero {

  @Input() destination: string = '';
  @Input() checkIn: string = '';
  @Input() checkOut: string = '';

  @Output() destinationChange = new EventEmitter<string>();
  @Output() checkInChange = new EventEmitter<string>();
  @Output() checkOutChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  onDestinationChange(value: string): void {
    this.destination = value;
    this.destinationChange.emit(value);
  }

  onCheckInChange(value: string): void {
    this.checkIn = value;
    this.checkInChange.emit(value);
  }

  onCheckOutChange(value: string): void {
    this.checkOut = value;
    this.checkOutChange.emit(value);
  }

  onSearchClick(): void {
    this.search.emit();
  }
}