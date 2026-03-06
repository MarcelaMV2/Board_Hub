import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansResolver } from './loans.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Game } from 'src/game/entities/game.entity';
import { Client } from 'src/clients/entities/client.entity';
import { LoanItem } from 'src/loans/entities/loan-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Game, Client, LoanItem])],
  providers: [LoansResolver, LoansService],
})
export class LoansModule {}
