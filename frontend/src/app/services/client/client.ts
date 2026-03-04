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

const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(createClientInput: $input) {
      id
      fullName
      dni
      telefono
      email
      perfil
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
  createClient(fullName: string, dni: number, telefono: number, email: string, perfil?: string) {
    return this.apollo.mutate({
      mutation: CREATE_CLIENT,
      variables: {
        input: { fullName, dni, telefono, email, perfil },
      },
      // Opcional: actualizar cache directamente para reflejar cambios instantáneos
      update: (cache, { data }) => {
        if (!data) return;
        const existing: any = cache.readQuery({ query: GET_CLIENTS });
        const newClient = (data as any).createClient;
        cache.writeQuery({
          query: GET_CLIENTS,
          data: { clients: [...(existing?.clients || []), newClient] },
        });
      },
    });
  }
}
