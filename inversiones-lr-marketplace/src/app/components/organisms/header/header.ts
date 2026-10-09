import { Component, EventEmitter, Output } from '@angular/core';
import { SearchBar } from '../../molecules/search-bar/search-bar';
import { IconComponent } from '../../atoms/icon/icon';
import { Logo } from '../../atoms/logo/logo';
import { LinkComponent } from '../../atoms/link/link';   // ← esta línea

@Component({
  imports: [SearchBar, IconComponent, Logo, LinkComponent],  // ← agrega LinkComponent aquí
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {

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
