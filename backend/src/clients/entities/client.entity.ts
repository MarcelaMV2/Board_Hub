import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Loan } from 'src/loans/entities/loan.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clients')
@ObjectType()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => Int)
  dni: number;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => Int)
  telefono: number;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  perfil?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => Int, { nullable: true })
  totalLoans: number;

  @Field(() => Int, { nullable: true })
  activeLoans: number;

  @CreateDateColumn({ name: 'create_date' })
  @Field(() => GraphQLISODateTime)
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  @Field(() => GraphQLISODateTime)
  updateDate: Date;

  @DeleteDateColumn({ name: 'delete_date' })
  @Field(() => GraphQLISODateTime, { nullable: true })
  deleteDate: Date;

  @OneToMany(() => Loan, (loans) => loans.client)
  @Field(() => [Loan])
  loans: Loan[];
}
