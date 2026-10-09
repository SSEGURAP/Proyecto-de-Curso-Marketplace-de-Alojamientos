import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Checkbox } from '../../atoms/checkbox/checkbox';
import { Label } from '../../atoms/label/label';

@Component({
  imports: [Label, Checkbox],
  selector: 'app-checkbox-group',
  styleUrl: './checkbox-group.css',
  templateUrl: './checkbox-group.html',
})
export class CheckboxGroup {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() selected: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();

  isSelected(option: string): boolean {
    return this.selected.includes(option);
  }

  onToggle(option: string, isChecked: boolean): void {
    if (isChecked) {
      this.selected = [...this.selected, option];
    } else {
      this.selected = this.selected.filter(item => item !== option);
    }
    this.selectedChange.emit(this.selected);
  }
}
