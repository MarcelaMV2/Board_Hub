import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-topbar',
  imports: [LucideAngularModule],
  templateUrl: './topbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  @Output() toggleSidebar = new EventEmitter<void>();
  readonly Menu = Menu;
}
