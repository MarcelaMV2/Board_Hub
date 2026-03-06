import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'btn-primary',
  imports: [LucideAngularModule],
  templateUrl: './btn-primary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnPrimary {
  @Input() label: string = '';
  @Input() icon?: any;
  @Output() clicked = new EventEmitter<void>;
}
