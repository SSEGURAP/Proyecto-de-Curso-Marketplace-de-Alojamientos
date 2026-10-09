import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-checkbox',
  styleUrl: './checkbox.css',
  templateUrl: './checkbox.html',
})
export class Checkbox {
  @Input() label: string = '';
  @Input() isChecked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  }
}
