import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [],
  templateUrl: './link.html',
  styleUrl: './link.css',
})
export class LinkComponent {

  @Input() label: string = '';
  @Input() href: string = '#';
  @Input() active: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  constructor(private router: Router) {}

  onClick(event: Event): void {
    event.preventDefault();

    if (this.href && this.href.startsWith('/')) {
      this.router.navigateByUrl(this.href);
    }

    this.clicked.emit();
  }
}