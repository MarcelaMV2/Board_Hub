import { Routes } from '@angular/router';
import { Games } from './pages/games/games';
import { Clients } from './pages/clients/clients';
import { Loans } from './pages/loans/loans';
import { Categories } from './pages/categories/categories';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page'),
    children: [
      {
        path: 'games',
        component: Games,
      },
      {
        path: 'clients',
        component: Clients,
      },
      {
        path: 'loans',
        component: Loans,
      },
      {
        path: 'categories',
        component: Categories,
      },
      {
        path: '**',
        redirectTo: 'games',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
