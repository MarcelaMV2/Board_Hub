import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from "../../components/shared/search-input/search-input";

@Component({
  selector: 'app-loans',
  imports: [PageHeader, SearchInput],
  templateUrl: './loans.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loans {
  openModalLoan() {}

  onSearch(term: string) {
    // filtrar tabla después
  }
}
