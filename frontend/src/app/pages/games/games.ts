import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { GameService } from '../../services/game/game';
import { StatusChip } from '../../components/shared/status-chip/status-chip';
import { BtnSecondary } from '../../components/shared/btn-secondary/btn-secondary';
import { Modal } from "../../components/shared/modal/modal";
import { ModalLayout } from "../../components/shared/modal-layout/modal-layout";
import { GameFormComponent } from "./game-form/game-form";

@Component({
  selector: 'app-games',
  imports: [PageHeader, SearchInput, StatusChip, BtnSecondary, Modal, ModalLayout, GameFormComponent],
  templateUrl: './games.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Games implements OnInit {
  games: any[] = [];

  filteredGames: any[] = [];
  selectedCategory: string = 'Todos';
  isCreateGameOpen = false;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.games = data;
        this.filteredGames = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.log(err),
    });
  }

  openModalGame() {
    this.isCreateGameOpen = true;
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filteredGames =
      category === 'Todos' ? this.games : this.games.filter((g) => g.category.name === category);
    this.cdr.markForCheck();
  }

  get categories() {
    const categorias = this.games.map((g) => g.category.name);
    return ['Todos', ...new Set(categorias)];
  }

  onSearch(term: string) {
    // filtrar tabla después
  }

  createGame(data: any) {
    const uploadFile = data.file;
    if (!uploadFile) return alert('Selecciona una imagen');
    const formData = new FormData();
    formData.append('file', uploadFile);
    fetch('http://localhost:3000/upload', { method: 'POST', body: formData })
      .then((res) => res.json())
      .then((upload) => {
        this.gameService
          .createGame(
            data.title,
            data.description,
            data.minPlayers,
            data.maxPlayers,
            data.stockTotal,
            data.durationGame,
            data.priceDay,
            data.idCategory,
            upload.url,
          )
          .subscribe({
            next: (res: any) => {
              const newGame = res.data?.createGame;
              if (newGame) {
                this.games = [...this.games, newGame];
                this.filteredGames = [...this.filteredGames, newGame];
                this.cdr.markForCheck();
              }
              this.isCreateGameOpen = false;
              this.cdr.markForCheck();
            },
            error: (err) => console.error(err),
          });
      });
  }

  editGame(game: any) {}
  deleteGame(id: string) {}
}
