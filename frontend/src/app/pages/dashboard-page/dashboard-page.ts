import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Layout } from '../../components/layout/layout';

@Component({
  selector: 'app-dashboard-page',
  imports: [Layout],
  templateUrl: './dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardPage {}
