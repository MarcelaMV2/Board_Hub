import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const GET_LOANS = gql`
  query {
    loans {
      id
      startDate
      endDate
      priceTotal
      status
      game {
        id
        title
        category { name }
      }
      client {
        id
        fullName
        telefono
        perfil
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class LoanService {
  constructor(private apollo: Apollo) {}

  getLoans() {
    return this.apollo
      .query<{ loans: any[] }>({ query: GET_LOANS })
      .pipe(map((result) => result.data!.loans));
  }
}
