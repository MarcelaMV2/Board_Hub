import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sidebar } from "./sidebar/sidebar";
import { Topbar } from "./topbar/topbar";

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Topbar],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout { }
