import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const games = gql`
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
        query: games,
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
    image?:string,
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
        const existing: any = cache.readQuery({ query: games });
        const newGame = (data as any).createGame;
        cache.writeQuery({
          query: games,
          data: { games: [...(existing?.games || []), newGame] },
        });
      },
    });
  }
}
