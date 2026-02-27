import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType
} from '@nestjs/graphql';
import { Game } from 'src/game/entities/game.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
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

  @CreateDateColumn({ name: 'create_date' })
  @Field(() => GraphQLISODateTime)
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  @Field(() => GraphQLISODateTime)
  updateDate: Date;

  @DeleteDateColumn({ name: 'delete_date' })
  @Field(() => GraphQLISODateTime, { nullable: true })
  deleteDate: Date;

  @OneToMany(() => Game, (game) => game.category)
  @Field(() => [Game])
  games: Game[];
}
