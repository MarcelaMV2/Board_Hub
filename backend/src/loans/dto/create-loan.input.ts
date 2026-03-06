// loans/dto/create-loan.input.ts
import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

@InputType()
export class LoanItemInput {
  @IsUUID()
  @Field(() => String)
  idGame: string;

  @IsInt()
  @Min(1)
  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateLoanInput {
  @IsUUID()
  @Field(() => String)
  idClient: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LoanItemInput)
  @Field(() => [LoanItemInput])
  items: LoanItemInput[];

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  note?: string;
}