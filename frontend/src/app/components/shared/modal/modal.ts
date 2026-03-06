import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  /*  onClose() {
    this.isOpen = false;
  } */
}
