import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

interface MenuOptions {
  icon: string;
  label: string;
  route: string;
}
@Component({
  selector: 'side-menu-items',
  imports: [RouterLink],
  templateUrl: './side-menu-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuItems {
  menuOptions: MenuOptions[] = [
    {
      icon: 'package.png',
      label: 'Prestamos',
      route: '/dashboard/loans'
    },
    {
      icon: 'dices.png',
      label: 'Juegos',
      route: '/dashboard/games'
    },
    {
      icon: 'user.png',
      label: 'Clientes',
      route: '/dashboard/clients'
    },
    {
      icon: 'user.png',
      label: 'Categorias',
      route: '/dashboard/categories'
    }
  ]
}
