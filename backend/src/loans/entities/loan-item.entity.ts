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
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from 'src/game/entities/game.entity';
import { Loan } from 'src/loans/entities/loan.entity';

@Entity({ name: 'loan_items' })
@ObjectType()
export class LoanItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'price_snapshot' })
  @Field(() => Int)
  priceSnapshot: number;

  @Column()
  @Field(() => Int)
  quantity: number;

  @Column()
  @Field(() => Int)
  subtotal: number;

  @CreateDateColumn({ name: 'create_date' })
  @Field(() => GraphQLISODateTime)
  createDate: Date;

  // Agrega al final de la clase, antes del último }
  @DeleteDateColumn({ name: 'delete_date' })
  @Field(() => GraphQLISODateTime, { nullable: true })
  deleteDate: Date;

  @ManyToOne(() => Loan, (loan) => loan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_loan' })
  @Field(() => Loan)
  loan: Loan;

  @ManyToOne(() => Game, (game) => game.loanItems)
  @JoinColumn({ name: 'id_game' })
  @Field(() => Game)
  game: Game;
}
