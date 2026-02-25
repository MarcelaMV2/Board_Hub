import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {

  @IsNotEmpty({message: 'El campo nombre no puede estar vacio'})
  @IsString({message: 'El campo nombre debe de ser de tipo cadena'})
  @Field(() => String)
  name: string;

  @IsString({message: 'El campo descripcion debe ser de tipo cadena'})
  @IsOptional()
  @Field(() => String)
  description: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  image?: string;
  
}
