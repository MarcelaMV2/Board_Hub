import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BtnSecondary } from '../../components/shared/btn-secondary/btn-secondary';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';
import { ModalLayout } from '../../components/shared/modal-layout/modal-layout';
import { Modal } from '../../components/shared/modal/modal';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { StatusChip } from '../../components/shared/status-chip/status-chip';
import { LoanService } from '../../services/loan/loan';
import { LoanForm } from './loan-form/loan-form';
import { ColumnDef, DataTable } from '../../components/shared/data-table/data-table';
import { CommonModule, DatePipe } from '@angular/common'; // 👈

@Component({
  selector: 'app-loans',
  imports: [
    CommonModule,
    PageHeader,
    SearchInput,
    BtnSecondary,
    Modal,
    ModalLayout,
    LoanForm,
    DataTable,
    StatusChip,
  ],
  templateUrl: './loans.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loans {
  loans: any[] = [];
  filteredLoans: any[] = [];
  selectedTab = 'Todos';
  tabs = ['Todos', 'Activos', 'Devueltos', 'Vencidos'];

  isCreateLoanOpen = false;
  isEditLoanOpen = false;
  isDeleteConfirmOpen = false;

  loanToEdit: any = null;
  loanToDeleteId: string | null = null;
  isDeleting = false;

  @Input() showView: boolean = false;
  @Output() view = new EventEmitter<any>();

  onView(row: any) {
    this.view.emit(row);
  }

  loanColumns: ColumnDef[] = [
    { key: 'index', label: 'N', type: 'index' },
    { key: 'cliente', label: 'Cliente', type: 'cliente' },
    { key: 'juegos', label: 'Juegos', type: 'game-badges' },
    { key: 'periodo', label: 'Período', type: 'text' },
    { key: 'estado', label: 'Estado', type: 'status-action' },
    { key: 'total', label: 'Total', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' },
  ];

  constructor(
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
  ) {}

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans() {
    this.loanService.getLoans().subscribe({
      next: (data) => {
        console.log('Loans mapeados:', data); // 👈
        this.loans = data;
        this.filteredLoans = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err),
    });
  }

  openModalLoan() {
    this.loanToEdit = null; // 👈 limpia antes de abrir
    this.isCreateLoanOpen = true;
    this.cdr.markForCheck();
  }

  closeModal() {
    this.isCreateLoanOpen = false;
  }

  onLoanSaved() {
    this.isCreateLoanOpen = false;
    this.loadLoans();
  }

  editLoan(loan: any) {
    this.loanToEdit = loan;
    this.isEditLoanOpen = true;
    this.cdr.markForCheck();
  }

  closeEditModal() {
    this.isEditLoanOpen = false;
    this.loanToEdit = null;
    this.cdr.markForCheck();
  }

  onLoanUpdated() {
    this.isEditLoanOpen = false;
    this.loanToEdit = null;
    this.loadLoans();
    this.cdr.markForCheck();
  }

  deleteLoan(loan: any) {
    this.loanToDeleteId = loan._raw.id;
    this.isDeleteConfirmOpen = true;
    this.cdr.markForCheck();
  }

  closeDeleteConfirm() {
    this.isDeleteConfirmOpen = false;
    this.loanToDeleteId = null;
    this.cdr.markForCheck();
  }

  confirmDelete() {
    console.log('loanToDeleteId:', this.loanToDeleteId);
    if (!this.loanToDeleteId) return;
    this.isDeleting = true;
    this.cdr.markForCheck();

    this.loanService.deleteLoan(this.loanToDeleteId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteConfirmOpen = false;
        this.loanToDeleteId = null;
        this.loadLoans();
      },
      error: (err) => {
        console.error(err);
        this.isDeleting = false;
        this.cdr.markForCheck();
      },
    });
  }

  filterByTab(tab: string) {
    this.selectedTab = tab;
    const map: Record<string, string> = {
      Activos: 'ACTIVO',
      Devueltos: 'DEVUELTO',
      Vencidos: 'VENCIDO',
    };
    this.filteredLoans =
      tab === 'Todos' ? this.loans : this.loans.filter((l) => l.estado === map[tab]);
    this.cdr.markForCheck();
  }

  onSearch(term: string) {
    const t = term.toLowerCase().trim();
    this.filteredLoans = !t
      ? this.loans
      : this.loans.filter(
          (l) =>
            l.nombre?.toLowerCase().includes(t) ||
            l.juegos?.some((j: any) => j.title.toLowerCase().includes(t)), // 👈 era j directamente
        );
    this.cdr.markForCheck();
  }

  isDetailModalOpen = false;
  loanToView: any = null;

  openDetailModal(loan: any) {
    this.loanToView = loan;
    this.isDetailModalOpen = true;
    this.cdr.markForCheck();
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.loanToView = null;
    this.cdr.markForCheck();
  }

  onStatusChange(event: { row: any; status: string }) {
    const id = event.row._raw.id;
    this.loanService.changeStatus(id, event.status).subscribe({
      next: () => this.loadLoans(),
      error: (err) => console.error(err),
    });
  }
  submitLoan() {
  }

}
