import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-layout',
  imports: [],
  templateUrl: './modal-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayout {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonLabel: string = '';
  @Output() buttonClick = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
