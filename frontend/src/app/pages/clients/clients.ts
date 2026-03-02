import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { ClientService } from '../../services/client/client';
import { StatusChip } from '../../components/shared/status-chip/status-chip';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-clients',
  imports: [PageHeader, SearchInput, StatusChip, DropdownMenu],
  templateUrl: './clients.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clients {
  clients: any[] = [];

  constructor(
    private clientService: ClientService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  getActiveLoans(loans: any[]) {
    return loans?.filter((l) => l.status === 'ACTIVO').length ?? 0;
  }

  getTotalLoans(loans: any[]) {
    return loans?.length ?? 0;
  }

  getInitials(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
  openModalClient() {}

  onSearch(term: string) {}
  editClient(client: any) {}
  deleteClient(id: string) {}
}
