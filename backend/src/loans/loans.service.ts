import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLoanInput } from './dto/create-loan.input';
import { UpdateLoanInput } from './dto/update-loan.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Repository } from 'typeorm';
import { Game } from 'src/game/entities/game.entity';
import { LoanChangeStatus } from './args/loan-change-status.args';
import { LoanStatus } from './enums/loan-status.enum';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,

    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async create(createLoanInput: CreateLoanInput): Promise<Loan> {
    const { idGame, idClient, startDate, endDate, quantity } = createLoanInput;

    const game = await this.gameRepository.findOneBy({ id: idGame });
    if (!game) throw new NotFoundException('El juego no esta registrado');

    if (!game.stockAvailable || game.stockAvailable < quantity)
      throw new BadRequestException('stock insuficiente');

    const client = await this.clientRepository.findOneBy({ id: idClient });
    if (!client) throw new NotFoundException('Cliente no registrado');

    if (endDate <= startDate)
      throw new BadRequestException(
        'La fecha de devolucion debe de ser mayor a un dia de la fecha de inicio',
      );

    const diffMs = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    game.stockAvailable = game.stockAvailable - quantity;
    await this.gameRepository.save(game);

    const priceTotal = days * quantity * game.priceDay;
    const newLoan = this.loanRepository.create({
      startDate,
      endDate,
      quantity,
      priceTotal,
      note: createLoanInput.note,
      game,
      client,
    });

    return await this.loanRepository.save(newLoan);
  }

  async findAll(): Promise<Loan[]> {
    return await this.loanRepository.find({
      relations: ['game', 'game.category', 'client']
    });
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOneBy({ id });
    if (!loan) throw new NotFoundException('Prestamo no registrado');
    return loan;
  }

  async update(id: string, updateLoanInput: UpdateLoanInput): Promise<Loan> {
    const loan = await this.findOne(id);
    Object.assign(loan, updateLoanInput);

    return this.loanRepository.save(loan);
  }

  async remove(id: string): Promise<Loan> {
    const loan = await this.findOne(id);
    return this.loanRepository.softRemove(loan);
  }

  async changeStatus(args: LoanChangeStatus): Promise<Loan> {
    const { id, status } = args;

    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['game'],
    });

    if (!loan) throw new NotFoundException('Prestamo no encontrado');

    if (loan.status === LoanStatus.DEVUELTO)
      throw new BadRequestException('El prestamo ya esta devuelto');

    if (status === LoanStatus.DEVUELTO) {
      loan.devolutionDate = new Date();

      loan.game.stockAvailable += loan.quantity;
      await this.gameRepository.save(loan.game);
    }

    loan.status = status;
    return this.loanRepository.save(loan);
  }
}
