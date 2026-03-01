import { ArgsType, Field, ID } from '@nestjs/graphql';
import { LoanStatus } from '../enums/loan-status.enum';
import { IsEnum, IsUUID } from 'class-validator';

@ArgsType()
export class LoanChangeStatus {
  @IsUUID()
  @Field(() => ID)
  id: string;

  @IsEnum(LoanStatus)
  @Field(() => LoanStatus)
  status: LoanStatus;
}
