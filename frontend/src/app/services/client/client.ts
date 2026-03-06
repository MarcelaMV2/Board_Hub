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
      totalLoans
      activeLoans
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

  private mapCliente(c: any) {
    const partes = c.fullName?.trim().split(' ') ?? [];
    const initials = partes
      .slice(0, 2)
      .map((p: string) => p[0]?.toUpperCase() ?? '')
      .join('');

    return {
      nombre: c.fullName,
      initials,
      avatar: c.perfil ?? null,
      dni: c.dni,
      celular: c.telefono,
      correo: c.email,
      prestamosActivos: c.activeLoans,
      totalPrestamos: c.totalLoans,
      _raw: c,
    };
  }

  getClients() {
    return this.apollo.query<{ clients: any[] }>({ query: GET_CLIENTS }).pipe(
      map((result) => result.data?.clients ?? []),
      map((clients) => clients.map((c) => this.mapCliente(c))),
    );
  }
  createClient(fullName: string, dni: number, telefono: number, email: string, perfil?: string) {
    return this.apollo.mutate({
      mutation: CREATE_CLIENT,
      variables: {
        input: { fullName, dni, telefono, email, perfil },
      },
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

  updateClient(
    id: string,
    fullName: string,
    dni: number,
    telefono: number,
    email: string,
    perfil?: string,
  ) {
    console.debug('updateClient variables', { id, fullName, dni, telefono, email, perfil });

    const UPDATE_CLIENT = gql`
      mutation UpdateClient($input: UpdateClientInput!) {
        updateClient(updateClientInput: $input) {
          id
          dni
          fullName
          telefono
          email
          perfil
          totalLoans
          activeLoans
        }
      }
    `;

    return this.apollo.mutate({
      mutation: UPDATE_CLIENT,
      variables: {
        input: { id, fullName, dni, telefono, email, perfil },
      },
      update: (cache, { data }) => {
        if (!data) return;
        const existing: any = cache.readQuery({ query: GET_CLIENTS }) || { clients: [] };
        const updatedClient = (data as any).updateClient;

        const existingClient = existing.clients.find((c: any) => c.id === updatedClient.id);
        const merged = {
          ...updatedClient,
          activeLoans: updatedClient.activeLoans ?? existingClient?.activeLoans ?? 0,
          totalLoans: updatedClient.totalLoans ?? existingClient?.totalLoans ?? 0,
        };

        cache.writeQuery({
          query: GET_CLIENTS,
          data: {
            clients: (existing?.clients || []).map((c: any) => (c.id === merged.id ? merged : c)),
          },
        });
      },
    });
  }

  deleteClient(id: string) {
    const DELETE_CLIENT = gql`
      mutation RemoveClient($id: String!) {
        removeClient(id: $id) {
          id
        }
      }
    `;

    return this.apollo.mutate({
      mutation: DELETE_CLIENT,
      variables: { id },
      update: (cache) => {
        const existing: any = cache.readQuery({ query: GET_CLIENTS });
        cache.writeQuery({
          query: GET_CLIENTS,
          data: {
            clients: (existing?.clients || []).filter((c: any) => c.id !== id),
          },
        });
      },
    });
  }
}
