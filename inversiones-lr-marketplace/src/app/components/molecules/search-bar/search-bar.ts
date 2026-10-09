import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';
import { InputComponent } from '../../atoms/input/input';

@Component({
  imports: [IconComponent, InputComponent],   // ← ESTO es lo que faltaba
  selector: 'app-search-bar',
  styleUrl: './search-bar.css',
  templateUrl: './search-bar.html',
})
export class SearchBar {

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
