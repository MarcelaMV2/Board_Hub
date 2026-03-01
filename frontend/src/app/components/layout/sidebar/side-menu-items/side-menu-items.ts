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
      icon: 'dices.png',
      label: 'Juegos',
      route: '/dashboard/juegos'
    },
    {
      icon: 'package.png',
      label: 'Prestamos',
      route: '/dashboard/prestamos'
    },
    {
      icon: 'user.png',
      label: 'Clientes',
      route: '/dashboard/clientes'
    }
  ]
}
