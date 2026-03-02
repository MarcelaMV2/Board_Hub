import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  imports: [],
  templateUrl: './dropdown-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenu {
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  isOpen = false;

  toggle(){
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }
}
