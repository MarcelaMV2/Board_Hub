import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn-primary',
  imports: [NgIf],
  templateUrl: './btn-primary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnPrimary {
  @Input() label: string = '';
  @Input() icon?: string;
  @Output() clicked = new EventEmitter<void>;
}
