import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';
import { CreateClientInput } from './create-client.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
