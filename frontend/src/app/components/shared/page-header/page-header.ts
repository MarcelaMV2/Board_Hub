import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnPrimary } from "../btn-primary/btn-primary";
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'page-header',
  imports: [BtnPrimary],
  templateUrl: './page-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonLabel: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  readonly Plus = Plus;
 }
