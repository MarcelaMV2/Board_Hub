import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from "../../components/shared/search-input/search-input";

@Component({
  selector: 'app-clients',
  imports: [PageHeader, SearchInput],
  templateUrl: './clients.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clients {
  openModalClient() {}

  onSearch(term: string) {
    // filtrar tabla después
  }
}
