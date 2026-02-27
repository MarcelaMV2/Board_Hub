import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateClientInput {
  @IsNumber()
  @Field(() => Int)
  dni: number;

  @IsString()
  @Field(() => String)
  fullName: string;

  @IsNumber()
  @Field(() => Int)
  telefono: number;

  @IsString()
  @Field(() => String)
  email: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  perfil: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @Field(() => String, { nullable: true })
  password: string;
}
