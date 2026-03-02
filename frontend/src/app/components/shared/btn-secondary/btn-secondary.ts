import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'btn-secondary',
  imports: [],
  templateUrl: './btn-secondary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnSecondary {
  @Input() tabs: string[] = [];
  @Input() selected: string = '';
  @Output() tabChange = new EventEmitter<string>();
}
