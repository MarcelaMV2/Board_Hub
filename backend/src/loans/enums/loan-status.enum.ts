import { registerEnumType } from '@nestjs/graphql';

export enum LoanStatus {
  ACTIVO = 'ACTIVO',
  VENCIDO = 'VENCIDO',
  DEVUELTO = 'DEVUELTO',
}

registerEnumType(LoanStatus, { name: 'LoanStatus' });
