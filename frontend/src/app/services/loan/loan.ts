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
      note
      client {
        id
        fullName
        telefono
        perfil
      }
      items {
        id
        quantity
        priceSnapshot
        subtotal
        game {
          id
          title
          image
          priceDay
          category {
            name
          }
        }
      }
    }
  }
`;

const CREATE_LOAN = gql`
  mutation CreateLoan($createLoanInput: CreateLoanInput!) {
    createLoan(createLoanInput: $createLoanInput) {
      id
      priceTotal
      status
      client {
        fullName
      }
      items {
        subtotal
        priceSnapshot
        quantity
        game {
          title
        }
      }
    }
  }
`;

const UPDATE_LOAN = gql`
  mutation UpdateLoan($updateLoanInput: UpdateLoanInput!) {
    updateLoan(updateLoanInput: $updateLoanInput) {
      id
      startDate
      endDate
      priceTotal
      status
      note
      client {
        id
        fullName
        telefono
        perfil
      }
      items {
        id
        quantity
        priceSnapshot
        subtotal
        game {
          id
          title
          image
          priceDay
          category {
            name
          }
        }
      }
    }
  }
`;

const DELETE_LOAN = gql`
  mutation RemoveLoan($id: String!) {
    removeLoan(id: $id) {
      id
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class LoanService {
  constructor(private apollo: Apollo) {}

  getLoans() {
    return this.apollo
      .query<{ loans: any[] }>({ query: GET_LOANS, fetchPolicy: 'network-only' })
      .pipe(
        map((result) => result.data!.loans),
        map((loans) => loans.map((l) => this.mapLoan(l))),
      );
  }

  private mapLoan(l: any) {
    const fullName = l.client?.fullName ?? '';
    return {
      nombre: fullName,
      initials: fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      avatar: l.client?.perfil ?? null,
      dni: l.client?.telefono,
      juegos:
        l.items?.map((i: any) => ({ title: i.game.title, image: i.game.image ?? null })) ?? [],

      periodo: `${this.formatDate(l.startDate)} – ${this.formatDate(l.endDate)}`,
      total: `Bs. ${l.priceTotal}`,
      estado: l.status,

      _raw: l,
    };
  }

  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  createLoan(input: {
    idClient: string;
    startDate: string;
    endDate: string;
    items: { idGame: string; quantity: number }[];
    note?: string;
  }) {
    return this.apollo
      .mutate<{ createLoan: any }>({
        mutation: CREATE_LOAN,
        variables: { createLoanInput: input },
      })
      .pipe(map((result) => result.data!.createLoan));
  }

  updateLoan(input: {
    id: string;
    startDate?: string;
    endDate?: string;
    items?: { idGame: string; quantity: number }[];
    note?: string;
  }) {
    return this.apollo
      .mutate<{ updateLoan: any }>({
        mutation: UPDATE_LOAN,
        variables: { updateLoanInput: input },
        fetchPolicy: 'no-cache',
        update: (cache, { data }) => {
          if (!data) return;
          const existing: any = cache.readQuery({ query: GET_LOANS });
          const updated = (data as any).updateLoan;
          cache.writeQuery({
            query: GET_LOANS,
            data: {
              loans: (existing?.loans || []).map((l: any) => (l.id === updated.id ? updated : l)),
            },
          });
        },
      })
      .pipe(map((result) => result.data!.updateLoan));
  }

  deleteLoan(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_LOAN,
      variables: { id },
      fetchPolicy: 'no-cache',
      update: (cache) => {
        const existing: any = cache.readQuery({ query: GET_LOANS });
        cache.writeQuery({
          query: GET_LOANS,
          data: {
            loans: (existing?.loans || []).filter((l: any) => l.id !== id),
          },
        });
      },
    });
  }

  CHANGE_STATUS = gql`
    mutation ChangeStatus($id: ID!, $status: LoanStatus!) {
      changeStatus(id: $id, status: $status) {
        id
        status
      }
    }
  `;

  changeStatus(id: string, status: string) {
    return this.apollo.mutate({
      mutation: this.CHANGE_STATUS,
      variables: { id, status },
      fetchPolicy: 'no-cache',
    });
  }
}
