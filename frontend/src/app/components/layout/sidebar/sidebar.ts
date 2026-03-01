import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuHeader } from "./side-menu-header/side-menu-header";
import { SideMenuItems } from "./side-menu-items/side-menu-items";

@Component({
  selector: 'app-sidebar',
  imports: [SideMenuHeader, SideMenuItems],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar { }
