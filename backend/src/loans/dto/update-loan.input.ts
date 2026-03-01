import { IsUUID } from 'class-validator';
import { CreateLoanInput } from './create-loan.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateLoanInput extends PartialType(CreateLoanInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
