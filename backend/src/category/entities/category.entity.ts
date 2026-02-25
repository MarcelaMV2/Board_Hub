import {
  ObjectType,
  Field,
  Int,
  ID,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'category' })
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('varchar', { length: 50 })
  @Field(() => String)
  name: string;

  @Column('varchar', { length: 200, nullable: true })
  @Field(() => String)
  description?: string;

  @Column('varchar', { nullable: true })
  @Field(() => String, { nullable: true})
  image?: string;

  @CreateDateColumn({ name: 'create_date' })
  @Field(() => GraphQLISODateTime)
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  @Field(() => GraphQLISODateTime)
  updateDate: Date;

  @DeleteDateColumn({ name: 'delete_date' })
  @Field(() => GraphQLISODateTime, { nullable: true })
  deleteDate: Date;
}
