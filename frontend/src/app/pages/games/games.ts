import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { GameService } from '../../services/game/game';
import { StatusChip } from "../../components/shared/status-chip/status-chip";
import { BtnSecondary } from "../../components/shared/btn-secondary/btn-secondary";

@Component({
  selector: 'app-games',
  imports: [PageHeader, SearchInput, StatusChip, BtnSecondary],
  templateUrl: './games.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Games implements OnInit {
  games: any[] = [];

  filteredGames: any[] = [];
  selectedCategory: string = 'Todos';

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
  openModalGame() {}

  onSearch(term: string) {
    // filtrar tabla después
  }
}
