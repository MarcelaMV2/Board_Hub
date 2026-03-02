import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn-primary',
  imports: [],
  templateUrl: './btn-primary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnPrimary {
  @Input() label: string = '';
  @Output() clicked = new EventEmitter<void>;
}
