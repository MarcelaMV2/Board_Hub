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
}
