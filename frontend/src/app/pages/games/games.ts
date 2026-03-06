import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeader } from '../../components/shared/page-header/page-header';
import { SearchInput } from '../../components/shared/search-input/search-input';
import { GameService } from '../../services/game/game';
import { StatusChip } from '../../components/shared/status-chip/status-chip';
import { BtnSecondary } from '../../components/shared/btn-secondary/btn-secondary';
import { DropdownMenu } from '../../components/shared/dropdown-menu/dropdown-menu';
import { Modal } from "../../components/shared/modal/modal";
import { ModalLayout } from "../../components/shared/modal-layout/modal-layout";
import { GameFormComponent } from "./game-form/game-form";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-games',
  imports: [
    PageHeader,
    SearchInput,
    StatusChip,
    BtnSecondary,
    DropdownMenu,
    Modal,
    ModalLayout,
    GameFormComponent,
  ],
  templateUrl: './games.html',
})
export class Games implements OnInit {
  games: any[] = [];
  filteredGames: any[] = [];
  selectedCategory: string = 'Todos';
  isGameModalOpen = false;
  selectedGame: any | null = null;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {}


  openCreateGameModal() {
    this.selectedGame = null;
    this.isGameModalOpen = true;
  }

  openEditGame(game: any) {
    this.selectedGame = game;
    this.isGameModalOpen = true;
  }

  closeGameModal() {
    this.isGameModalOpen = false;
    this.selectedGame = null;
    this.cdr.markForCheck();
  }

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
      category === 'Todos'
        ? this.games
        : this.games.filter((g) => g.category?.name === category);
    this.cdr.markForCheck();
  }

  get categories() {
    const categorias = this.games
      .map((g) => g.category?.name)
      .filter((n) => !!n);
    return ['Todos', ...new Set(categorias)];
  }

  onSearch(term: string) {
    // filtrar tabla después
  }

  saveGame(data: any) {
    const uploadFile = data.file;

    const finishEditing = () => {
      this.isGameModalOpen = false;
      this.selectedGame = null;
    };

    const performMutation = (imageUrl?: string) => {
      if (this.selectedGame) {

        this.gameService
          .updateGame(
            this.selectedGame.id,
            data.title,
            data.description,
            data.minPlayers,
            data.maxPlayers,
            data.stockTotal,
            data.durationGame,
            data.priceDay,
            data.idCategory,
            imageUrl || this.selectedGame.image,
          )
          .subscribe({
            next: (res: any) => {
              const updated = res.data?.updateGame;
              if (updated) {
                const merged = {
                  ...updated,
                  category: updated.category || this.selectedGame?.category,
                };
                this.games = this.games.map((g) =>
                  g.id === merged.id ? merged : g,
                );
                this.filteredGames = this.filteredGames.map((g) =>
                  g.id === merged.id ? merged : g,
                );
                this.cdr.markForCheck();
                this.snackBar.open('Juego actualizado ✅', 'Cerrar', {
                  duration: 3000,
                  panelClass: ['success-snackbar'],
                });
              }
              finishEditing();
              this.cdr.markForCheck();
              this.cdr.markForCheck();
            },
            error: (err) => this.handleError(err, 'actualizar'),
          });
      } else {
        if (!uploadFile) {
          this.snackBar.open('Selecciona una imagen', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          return;
        }

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
                    this.snackBar.open('Juego creado correctamente ✅', 'Cerrar', {
                      duration: 3000,
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                      panelClass: ['success-snackbar'],
                    });
                  }
                  finishEditing();
                  this.cdr.markForCheck();
                },
                error: (err) => this.handleError(err, 'crear'),
              });
          })
          .catch(() => {
            this.snackBar.open('Error al subir la imagen', 'Cerrar', {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          });
      }
    };

    if (uploadFile && this.selectedGame) {
      const formData = new FormData();
      formData.append('file', uploadFile);
      fetch('http://localhost:3000/upload', { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((upload) => performMutation(upload.url))
        .catch(() => {
          this.snackBar.open('Error al subir la imagen', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        });
    } else {
      performMutation();
    }
  }

  private handleError(err: any, action: string) {
    let errorMessage = `Error al ${action} el juego`;

    if (err?.error?.errors?.length) {
      errorMessage = err.error.errors[0].message;
    } else if (err?.graphQLErrors?.length) {
      errorMessage = err.graphQLErrors[0].message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    if (errorMessage.toLowerCase().includes('duplicate key')) {
      errorMessage = 'Ya existe un juego con ese valor. Modifica los datos e intenta de nuevo.';
    }

    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  editGame(game: any) {
    this.openEditGame(game);
  }

  deleteGame(id: string) {
    const confirmed = confirm('¿Estás seguro que deseas eliminar este juego?');
    if (!confirmed) return;

    this.gameService.deleteGame(id).subscribe({
      next: () => {
        this.games = this.games.filter((g) => g.id !== id);
        this.filteredGames = this.filteredGames.filter((g) => g.id !== id);
        this.cdr.markForCheck();
        this.snackBar.open('Juego eliminado ✅', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => this.handleError(err, 'eliminar'),
    });
  }
}
