import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { LoanStatus } from '../enums/loan-status.enum';

@InputType()
export class CreateLoanInput {
  @IsUUID()
  @Field(() => String)
  idGame: string;

  @IsUUID()
  @Field(() => String)
  idClient: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @IsNumber()
  @Min(1)
  @Field(() => Int)
  quantity: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  note: string;
}
