import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBar } from '../../molecules/search-bar/search-bar';
import { Logo } from '../../atoms/logo/logo';
import { LinkComponent } from '../../atoms/link/link';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBar, Logo, LinkComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
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

  constructor(private router: Router) {}

  onSearch(): void {
    this.search.emit({
      destination: this.destination,
      checkIn: this.checkIn,
      checkOut: this.checkOut
    });
  }

  irAHome(): void {
    this.router.navigate(['/home']);
  }
}