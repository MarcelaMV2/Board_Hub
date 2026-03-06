import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Package, Dices, Users, LayoutGrid } from 'lucide-angular';

/* interface MenuOptions {
  icon: string;
  label: string;
  route: string;
} */
@Component({
  selector: 'side-menu-items',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './side-menu-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuItems {
  readonly Package = Package;
  readonly Dices = Dices;
  readonly Users = Users;
  readonly LayoutGrid = LayoutGrid;

  @Output() itemClicked = new EventEmitter<void>();
  // menuOptions: MenuOptions[] = [
  menuOptions = [
    {
      icon: this.Package,
      label: 'Prestamos',
      route: '/dashboard/loans',
    },
    {
      icon: this.Dices,
      label: 'Juegos',
      route: '/dashboard/games',
    },
    {
      icon: this.Users,
      label: 'Clientes',
      route: '/dashboard/clients',
    },
    {
      icon: this.LayoutGrid,
      label: 'Categorias',
      route: '/dashboard/categories',
    },
  ];
}
