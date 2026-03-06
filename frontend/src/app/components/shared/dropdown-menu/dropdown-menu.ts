import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  imports: [],
  templateUrl: './dropdown-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenu {
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  @Output() onView = new EventEmitter<void>(); // 👈
  @Input() showView: boolean = false;

  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }
}
