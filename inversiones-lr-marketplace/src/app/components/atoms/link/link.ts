import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-link',
  styleUrl: './link.css',
  templateUrl: './link.html',
})
export class LinkComponent {

  @Input() label: string = '';
  @Input() href: string = '#';
  @Input() active: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  onClick(event: Event): void {
    event.preventDefault();
    this.clicked.emit();
  }

}
