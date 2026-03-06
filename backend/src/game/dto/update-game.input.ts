import { IsUUID } from 'class-validator';
import { CreateGameInput } from './create-game.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateGameInput extends PartialType(CreateGameInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
