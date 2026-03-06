import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { Topbar } from './topbar/topbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Topbar, RouterOutlet],
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  sidebarOpen = signal(window.innerWidth >= 1024);

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      this.sidebarOpen.set(true);
    } else {
      this.sidebarOpen.set(false);
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  isSmallScreen() {
    return window.innerWidth < 1024;
  }
}
