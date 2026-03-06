import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../services/game/game';
import { ClientService } from '../../../services/client/client';
import { LoanService } from '../../../services/loan/loan';

interface SelectedGame {
  game: any;
  quantity: number;
}

@Component({
  selector: 'app-loan-form',
  imports: [FormsModule],
  templateUrl: './loan-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanForm implements OnInit, OnChanges {
  @Output() cancel = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Input() loanToEdit: any = null;

  allClients: any[] = [];
  allGames: any[] = [];

  clientSearch = '';
  gameSearch = '';
  filteredClients: any[] = [];
  filteredGames: any[] = [];

  selectedClient: any = null;
  selectedGames: SelectedGame[] = [];

  startDate = '';
  endDate = '';

  note = '';
  days = 0;
  priceTotal = 0;

  selectedStatus: string = 'ACTIVO';

  endDateError = false;
  quantityError: { [gameId: string]: string } = {};

  constructor(
    private gameService: GameService,
    private clientService: ClientService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
  ) {}

  get isEditMode(): boolean {
    return !!this.loanToEdit;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loanToEdit']) {
      if (this.loanToEdit) {
        this.loadLoanToEdit();
      } else {
        this.resetForm();
      }
    }
  }

  private loadLoanToEdit() {
    const loan = this.loanToEdit._raw ?? this.loanToEdit;

    this.selectedStatus = loan.status;
    this.startDate = this.toInputDate(new Date(loan.startDate));
    this.endDate = this.toInputDate(new Date(loan.endDate));
    this.note = loan.note ?? '';
    this.selectedClient = {
      nombre: loan.client.fullName,
      celular: loan.client.telefono,
      avatar: loan.client.perfil ?? null,
      initials: loan.client.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      prestamosActivos: 0,
      _raw: loan.client,
    };

    this.selectedGames = loan.items.map((item: any) => {
      const fullGame = this.allGames.find((g) => g.id === item.game.id);
      return {
        game: {
          ...item.game,
          stockAvailable: fullGame ? fullGame.stockAvailable + item.quantity : item.quantity,
          priceDay: item.game.priceDay ?? item.priceSnapshot,
        },
        quantity: item.quantity,
      };
    });

    this.recalcTotal();
    this.cdr.markForCheck();
  }

  ngOnInit() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.startDate = this.toInputDate(today);
    this.endDate = this.toInputDate(tomorrow);
    this.recalcTotal();

    this.gameService.getGames().subscribe({
      next: (games) => {
        this.allGames = games;
        this.filteredGames = games;
        this.cdr.markForCheck();
      },
    });

    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.allClients = clients;
        this.cdr.markForCheck();
      },
    });
  }

  onClientSearch() {
    if (this.selectedClient) return;
    const term = this.clientSearch.toLowerCase();
    this.filteredClients = this.allClients.filter(
      (c) => c.nombre?.toLowerCase().includes(term) || String(c.celular).includes(term), // 👈 era fullName // 👈 era telefono
    );
    this.cdr.markForCheck();
  }

  selectClient(client: any) {
    this.selectedClient = client;
    this.clientSearch = '';
    this.filteredClients = [];
    this.cdr.markForCheck();
  }

  clearClient() {
    this.selectedClient = null;
    this.clientSearch = '';
    this.filteredClients = [];
    this.cdr.markForCheck();
  }

  hasActiveLoan(client: any): boolean {
    return client.prestamosActivos > 0;
  }

  onGameSearch() {
    const term = this.gameSearch.toLowerCase();
    this.filteredGames = this.allGames.filter(
      (g) => g.title.toLowerCase().includes(term) || g.category.name.toLowerCase().includes(term),
    );
    this.cdr.markForCheck();
  }

  addGame(game: any) {
    if (this.isGameSelected(game) || game.stockAvailable === 0) return;
    this.selectedGames = [...this.selectedGames, { game, quantity: 1 }];
    this.recalcTotal();
    this.cdr.markForCheck();
  }

  removeGame(item: SelectedGame) {
    this.selectedGames = this.selectedGames.filter((s) => s.game.id !== item.game.id);
    this.recalcTotal();
    this.cdr.markForCheck();
  }

  increaseQty(item: SelectedGame) {
    if (item.quantity >= item.game.stockAvailable) {
      this.quantityError[item.game.id] = `Máximo ${item.game.stockAvailable} unidades disponibles`; // 👈
      this.cdr.markForCheck();
      return;
    }
    delete this.quantityError[item.game.id];
    item.quantity++;
    this.recalcTotal();
    this.cdr.markForCheck();
  }

  decreaseQty(item: SelectedGame) {
    if (item.quantity <= 1) return;
    item.quantity--;
    this.recalcTotal();
    this.cdr.markForCheck();
  }

  isGameSelected(game: any): boolean {
    return this.selectedGames.some((s) => s.game.id === game.id);
  }

  recalcTotal() {
    this.endDateError = false;

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).getTime();
      const end = new Date(this.endDate).getTime();

      if (end < start) {
        this.endDateError = true;
        this.days = 0;
        this.priceTotal = 0;
        this.cdr.markForCheck();
        return;
      }

      const diff = end - start;
      this.days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    } else {
      this.days = 0;
    }

    this.priceTotal = this.selectedGames.reduce(
      (acc, item) => acc + item.game.priceDay * item.quantity * this.days,
      0,
    );
    this.cdr.markForCheck();
  }

  canSubmit(): boolean {
    if (this.isEditMode) {
      return this.selectedGames.length > 0 && this.days > 0 && !this.endDateError;
    }
    return (
      !!this.selectedClient &&
      !this.hasActiveLoan(this.selectedClient) &&
      this.selectedGames.length > 0 &&
      this.days > 0 &&
      !this.endDateError
    );
  }

  submit() {
    if (!this.canSubmit()) return;

    if (this.isEditMode) {
      const loan = this.loanToEdit._raw ?? this.loanToEdit;
      const input = {
        id: loan.id,
        startDate: new Date(this.startDate + 'T12:00:00').toISOString(),
        endDate: new Date(this.endDate + 'T12:00:00').toISOString(),
        items: this.selectedGames.map((s) => ({
          idGame: s.game.id,
          quantity: s.quantity,
        })),
        note: this.note || undefined,
      };

      const statusChanged = this.selectedStatus !== loan.status;

      if (statusChanged) {
        // Primero cambia estado, luego actualiza
        this.loanService.changeStatus(loan.id, this.selectedStatus).subscribe({
          next: () => {
            this.loanService.updateLoan(input).subscribe({
              next: () => {
                this.saved.emit();
                this.resetForm();
              },
              error: (err) => console.error('Update error:', err?.error?.errors),
            });
          },
          error: (err) => console.error('Status error:', err),
        });
      } else {
        this.loanService.updateLoan(input).subscribe({
          next: () => {
            this.saved.emit();
            this.resetForm();
          },
          error: (err) => console.error('Update error:', err?.error?.errors),
        });
      }
      return;
    }
    const input = {
      idClient: this.selectedClient._raw.id,
      startDate: new Date(this.startDate).toISOString(),
      endDate: new Date(this.endDate).toISOString(),
      items: this.selectedGames.map((s) => ({
        idGame: s.game.id,
        quantity: s.quantity,
      })),
      note: this.note || undefined,
    };

    this.loanService.createLoan(input).subscribe({
      next: () => {
        this.saved.emit();
        this.resetForm();
      },
      error: (err) => console.error('GraphQL error:', err?.error?.errors),
    });
  }
  resetForm() {
    this.selectedClient = null;
    this.selectedGames = [];
    this.clientSearch = '';
    this.gameSearch = '';
    this.note = '';
    this.endDateError = false;
    this.recalcTotal();
    this.cdr.markForCheck();
  }

  getInitials(fullName: string) {
    return fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  private toInputDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
