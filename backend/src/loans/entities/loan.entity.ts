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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoanStatus } from '../enums/loan-status.enum';
import { Game } from 'src/game/entities/game.entity';
import { Client } from 'src/clients/entities/client.entity';
import { LoanItem } from 'src/loans/entities/loan-item.entity';

@Entity({ name: 'loans' })
@ObjectType()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'timestamp'})
  @Field(() => GraphQLISODateTime)
  startDate: Date;
  
  @Column({ type: 'timestamp'})
  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Column()
  @Field(() => Int)
  priceTotal: number;

  @Column({ nullable: true })
  @Field(() => GraphQLISODateTime, { nullable: true })
  devolutionDate?: Date;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.ACTIVO
  })
  @Field(() => LoanStatus)
  status: LoanStatus

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  note: string;

  @CreateDateColumn({ name: 'create_date' })
  @Field(() => GraphQLISODateTime)
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  @Field(() => GraphQLISODateTime)
  updateDate: Date;

  @DeleteDateColumn({ name: 'delete_date' })
  @Field(() => GraphQLISODateTime, { nullable: true })
  deleteDate: Date;

  @OneToMany(() => LoanItem, (item) => item.loan, { cascade: true })
  @Field(() => [LoanItem])
  items: LoanItem[];


  @ManyToOne(()=> Client, (client) => client.loans)
  @JoinColumn({name: 'id_client'})
  @Field(()=> Client)
  client: Client;


  
}
