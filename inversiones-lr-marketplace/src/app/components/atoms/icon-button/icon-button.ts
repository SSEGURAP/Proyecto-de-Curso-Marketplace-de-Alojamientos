import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-icon-button',
  styleUrl: './icon-button.css',
  templateUrl: './icon-button.html',
})
export class IconButton {
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick(): void { 
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
