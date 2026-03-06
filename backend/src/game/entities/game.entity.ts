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
import { LoanItem } from 'src/loans/entities/loan-item.entity';

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

  @Column({ name: 'stock_available' })
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

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
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

  @ManyToOne(() => Category, (category) => category.games)
  @JoinColumn({ name: 'id_category' })
  @Field(() => Category)
  category: Category;

  @OneToMany(() => LoanItem, (item) => item.game)
  @Field(() => [LoanItem])
  loanItems: LoanItem[];

  // constructor(
  //   id: string,
  //   title: string,
  //   description: string,
  //   minPlayers: number,
  //   maxPlayers: number,
  //   stockTotal: number,
  //   stockAvailable: number,
  //   status: GameStatus,
  //   durationGame: number,
  //   priceDay: number,
  //   image: string,
  //   createDate: Date,
  //   updateDate: Date,
  //   deleteDate: Date,
  //   category: Category,
  //   loanItems?: LoanItem[], // Opcional
  // ) {
  //   this.id = id;
  //   this.title = title;
  //   this.description = description;
  //   this.minPlayers = minPlayers;
  //   this.maxPlayers = maxPlayers;
  //   this.stockTotal = stockTotal;
  //   this.stockAvailable = stockAvailable; // También corregí esto
  //   this.status = status || GameStatus.DISPONIBLE;
  //   this.durationGame = durationGame;
  //   this.priceDay = priceDay;
  //   this.image = image;
  //   this.createDate = new Date();
  //   this.updateDate = new Date();
  //   this.deleteDate = deleteDate;
  //   this.category = category;
  //   if (loanItems) {
  //     this.loanItems = loanItems; // Solo asigna si se proporciona
  //   }
  // }

  // updateStockAvailable(quantity: number): void {
  //   this.stockAvailable -= quantity;
  // }
}
