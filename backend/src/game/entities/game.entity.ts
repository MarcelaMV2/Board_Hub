import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { GameStatus } from '../enums/game_status.enum';
import { Category } from 'src/category/entities/category.entity';
import { Loan } from 'src/loans/entities/loan.entity';

@Entity({ name: 'games' })
@Unique(['title', 'category'])
@ObjectType()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  // @Column({ name: 'id_Category' })
  // @Field(() => String)
  // idCategory: string;

  @Column({ unique: true })
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column({ name: 'min_players' })
  @Field(() => Int)
  minPlayers: number;

  @Column({ name: 'max_players' })
  @Field(() => Int)
  maxPlayers: number;

  @Column({ name: 'stock_total' })
  @Field(() => Int)
  stockTotal: number;

  @Column({ name: 'stock_available'})
  @Field(() => Int)
  stockAvailable: number;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.DISPONIBLE,
  })
  @Field(() => GameStatus)
  status: GameStatus;

  @Column({ name: 'duration_game(mnts)' })
  @Field(() => Int)
  durationGame: number;

  @Column({ name: 'price_for_day' })
  @Field(() => Int)
  priceDay: number;

  @CreateDateColumn({ name: 'create_date' })
  @Field(() => GraphQLISODateTime)
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  @Field(() => GraphQLISODateTime)
  updateDate: Date;

  @DeleteDateColumn({ name: 'delete_date' })
  @Field(() => GraphQLISODateTime, { nullable: true })
  deleteDate: Date;

  @ManyToOne(() => Category, (category) => category.games)
  @JoinColumn({ name: 'id_category' })
  @Field(() => Category)
  category: Category;

  @OneToMany(() => Loan, (loan) => loan.game)
  @Field(() => [Loan])
  loans: Loan[];
}
