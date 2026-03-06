import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateGameInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'El campo titulo no puede estar vacio' })
  title: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'El campo descripcion no puede estar vacio' })
  description: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  minPlayers: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  maxPlayers: number;

  @Field(() => Int)
  @IsNotEmpty({ message: 'El Stock Total no puede estar vacio' })
  stockTotal: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  durationGame: number;

  @Field(() => Int)
  @IsNotEmpty({ message: 'El campo de precio no puede ir vacio' })
  priceDay: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image: string;

  @Field(() => String)
  idCategory: string;
}
