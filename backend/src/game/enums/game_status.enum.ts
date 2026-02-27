import { registerEnumType } from '@nestjs/graphql';

export enum GameStatus {
  DISPONIBLE = 'DISPONIBLE',
  AGOTADO = 'AGOTADO',
}

registerEnumType(GameStatus, { name: 'GameStatus' });
