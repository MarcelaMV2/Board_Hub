import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const GET_GAMES = gql`
  query {
    games {
      id
      title
      description
      minPlayers
      maxPlayers
      stockTotal
      stockAvailable
      status
      durationGame
      priceDay
      image
      category {
        id
        name
      }
    }
  }
`;

const CREATE_GAME = gql`
  mutation CreateGame($input: CreateGameInput!) {
    createGame(createGameInput: $input) {
      id
      title
      description
      minPlayers
      maxPlayers
      stockTotal
      stockAvailable
      status
      durationGame
      priceDay
      image
      category {
        id
        name
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private apollo: Apollo) {}

  getGames() {
    return this.apollo
      .query<{ games: any[] }>({
        query: GET_GAMES,
      })
      .pipe(map((result) => result.data!.games));
  }

  createGame(
    title: string,
    description: string,
    minPlayers: number,
    maxPlayers: number,
    stockTotal: number,
    durationGame: number,
    priceDay: number,
    idCategory: string,
    image?: string,
  ) {
    return this.apollo.mutate({
      mutation: CREATE_GAME,
      variables: {
        input: {
          title,
          description,
          minPlayers,
          maxPlayers,
          stockTotal,
          durationGame,
          priceDay,
          idCategory,
          image,
        },
      },
      update: (cache, { data }) => {
        if (!data) return;
        const existing: any = cache.readQuery({ query: GET_GAMES });
        const newGame = (data as any).createGame;
        cache.writeQuery({
          query: GET_GAMES,
          data: { games: [...(existing?.games || []), newGame] },
        });
      },
    });
  }

  updateGame(
    id: string,
    title: string,
    description: string,
    minPlayers: number,
    maxPlayers: number,
    stockTotal: number,
    durationGame: number,
    priceDay: number,
    idCategory: string,
    image?: string,
  ) {
    console.debug('updateGame variables', {
      id,
      title,
      description,
      minPlayers,
      maxPlayers,
      stockTotal,
      durationGame,
      priceDay,
      idCategory,
      image,
    });

    const UPDATE_GAME = gql`
      mutation UpdateGame($input: UpdateGameInput!) {
        updateGame(updateGameInput: $input) {
          id
          title
          description
          minPlayers
          maxPlayers
          stockTotal
          stockAvailable
          status
          durationGame
          priceDay
          image
          # category intentionally omitted; server sometimes returns null for this non-nullable field
        }
      }
    `;

    return this.apollo.mutate({
      mutation: UPDATE_GAME,
      variables: {
        input: {
          id,
          title,
          description,
          minPlayers,
          maxPlayers,
          stockTotal,
          durationGame,
          priceDay,
          idCategory,
          image,
        },
      },
      fetchPolicy: 'no-cache',
      update: (cache, { data }) => {
        if (!data) return;
        const existing: any = cache.readQuery({ query: GET_GAMES });
        const updatedGame = (data as any).updateGame;
        const merged = {
          ...updatedGame,
          category:
            updatedGame.category ||
            existing?.games.find((g: any) => g.id === updatedGame.id)?.category,
        };
        cache.writeQuery({
          query: GET_GAMES,
          data: {
            games: (existing?.games || []).map((g: any) =>
              g.id === merged.id ? merged : g,
            ),
          },
        });
      },
    });
  }

  deleteGame(id: string) {
    const DELETE_GAME = gql`
      mutation RemoveGame($id: String!) {
        removeGame(id: $id) {
          id
        }
      }
    `;

    return this.apollo.mutate({
      mutation: DELETE_GAME,
      variables: { id },
      fetchPolicy: 'no-cache',
      update: (cache) => {
        const existing: any = cache.readQuery({ query: GET_GAMES });
        cache.writeQuery({
          query: GET_GAMES,
          data: {
            games: (existing?.games || []).filter((g: any) => g.id !== id),
          },
        });
      },
    });
  }}
