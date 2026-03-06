export interface Loan {
  id: string;
  status: string;
}

export interface Client {
  id: string;
  fullName: string;
  dni: string;
  telefono: string;
  email: string;
  perfil: string;
  loans: Loan[];
}
