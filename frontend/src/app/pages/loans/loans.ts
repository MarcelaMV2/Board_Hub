import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { LoanService } from '../../services/loan/loan';
import { BtnSecondary } from '../../components/shared/btn-secondary/btn-secondary';
import { StatusChip } from '../../components/shared/status-chip/status-chip';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-loans',
  imports: [PageHeader, SearchInput, BtnSecondary, StatusChip, DropdownMenu],
  templateUrl: './loans.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loans {
  loans: any[] = [];
  filteredLoans: any[] = [];
  selectedTab = 'Todos';
  tabs = ['Todos', 'Activos', 'Devueltos', 'Vencidos'];

  constructor(
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loanService.getLoans().subscribe({
      next: (data) => {
        console.log(
          'Status values:',
          data.map((l) => l.status),
        );
        this.loans = data;
        this.filteredLoans = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  filterByTab(tab: string) {
    this.selectedTab = tab;
    const map: Record<string, string> = {
      Todos: 'Todos',
      Activos: 'ACTIVO',
      Devueltos: 'DEVUELTO',
      Vencidos: 'VENCIDO',
    };
    console.log('tab recibido:', JSON.stringify(tab));
    this.filteredLoans =
      tab === 'Todos' ? this.loans : this.loans.filter((l) => l.status === map[tab]);
    this.cdr.markForCheck();
  }

  getChipType(status: string): any {
    const map: Record<string, string> = {
      ACTIVO: 'active',
      DEVUELTO: 'devuelto',
      VENCIDO: 'vencido',
    };
    return map[status] ?? 'sin-prestamos';
  }

  getChipLabel(status: string): string {
    const map: Record<string, string> = {
      ACTIVO: 'Activo',
      DEVUELTO: 'Devuelto',
      VENCIDO: 'Vencido',
    };
    return map[status] ?? status;
  }

  getInitials(fullName: string) {
    return fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  openModalLoan() {}
  onSearch(term: string) {}
  editLoan(loan: any) {}
  deleteLoan(id: string) {}
}
