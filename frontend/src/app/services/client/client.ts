import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const GET_CLIENTS = gql`
  query {
    clients {
      id
      dni
      fullName
      telefono
      email
      perfil
      loans {
        id
        status
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private apollo: Apollo) {}

  getClients() {
    return this.apollo
      .query<{ clients: any[] }>({ query: GET_CLIENTS })
      .pipe(map((result) => result.data!.clients));
  }
}
