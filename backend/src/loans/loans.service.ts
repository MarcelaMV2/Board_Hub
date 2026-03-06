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
import { LoanItem } from 'src/loans/entities/loan-item.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,

    @InjectRepository(LoanItem)
    private readonly loanItemRepository: Repository<LoanItem>,

    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async create(createLoanInput: CreateLoanInput): Promise<Loan> {
    const { idClient, startDate, endDate, items, note } = createLoanInput;

    const client = await this.clientRepository.findOneBy({ id: idClient });
    if (!client) throw new NotFoundException('Cliente no registrado');

    const activeLoan = await this.loanRepository.findOne({
      where: { client: { id: idClient }, status: LoanStatus.ACTIVO },
    });
    if (activeLoan)
      throw new BadRequestException('El cliente ya tiene un préstamo activo');

    if (endDate <= startDate)
      throw new BadRequestException(
        'La fecha de devolucion debe de ser mayor a un dia de la fecha de inicio',
      );

    const diffMs = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const loanItems: LoanItem[] = [];
    let priceTotal = 0;

    for (const itemInput of items) {
      const game = await this.gameRepository.findOneBy({
        id: itemInput.idGame,
      });
      if (!game)
        throw new NotFoundException(`Juego ${itemInput.idGame} no encontrado`);

      if (!game.stockAvailable || game.stockAvailable < itemInput.quantity)
        throw new BadRequestException(
          `Stock insuficiente para el juego "${game.title}"`,
        );

      const subtotal = game.priceDay * itemInput.quantity * days;
      priceTotal += subtotal;

      // Descontar stock
      game.stockAvailable -= itemInput.quantity;
      // game.updateStockAvailable(itemInput.quantity);
      await this.gameRepository.save(game);

      // Crear LoanItem (sin guardar aún, lo hace cascade)
      const loanItem = this.loanItemRepository.create({
        game,
        quantity: itemInput.quantity,
        priceSnapshot: game.priceDay, // snapshot del precio actual
        subtotal,
      });
      loanItems.push(loanItem);
    }
    const newLoan = this.loanRepository.create({
      startDate,
      endDate,
      priceTotal,
      note: createLoanInput.note,
      client,
      items: loanItems,
    });

    return await this.loanRepository.save(newLoan);
  }

  async findAll(): Promise<Loan[]> {
    return await this.loanRepository.find({
      relations: ['client', 'items', 'items.game', 'items.game.category'],
    });
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['client', 'items', 'items.game', 'items.game.category'],
    });
    if (!loan) throw new NotFoundException('Préstamo no registrado');
    return loan;
  }

  async update(id: string, updateLoanInput: UpdateLoanInput): Promise<Loan> {
    const { items, startDate, endDate, note } = updateLoanInput;

    const loan = await this.findOne(id);

    // ── Fechas y nota ──
    if (startDate) loan.startDate = startDate;
    if (endDate) loan.endDate = endDate;
    if (note !== undefined) loan.note = note;

    // ── Recalcular días ──
    const diffMs = loan.endDate.getTime() - loan.startDate.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // ── Items ──
    if (items && items.length > 0) {
      // 1. Restaurar stock de items anteriores
      for (const oldItem of loan.items) {
        oldItem.game.stockAvailable += oldItem.quantity;
        await this.gameRepository.save(oldItem.game);
      }

      // 2. Eliminar items anteriores
      await this.loanItemRepository.delete({ loan: { id } });

      // 3. Crear nuevos items
      const newItems: LoanItem[] = [];
      let priceTotal = 0;

      for (const itemInput of items) {
        const game = await this.gameRepository.findOneBy({
          id: itemInput.idGame,
        });
        if (!game)
          throw new NotFoundException(
            `Juego ${itemInput.idGame} no encontrado`,
          );

        if (game.stockAvailable < itemInput.quantity)
          throw new BadRequestException(
            `Stock insuficiente para "${game.title}"`,
          );

        const subtotal = game.priceDay * itemInput.quantity * days;
        priceTotal += subtotal;

        // Descontar stock
        game.stockAvailable -= itemInput.quantity;
        await this.gameRepository.save(game);

        const loanItem = this.loanItemRepository.create({
          game,
          quantity: itemInput.quantity,
          priceSnapshot: game.priceDay,
          subtotal,
        });
        newItems.push(loanItem);
      }

      loan.items = newItems;
      loan.priceTotal = priceTotal;
    }

    await this.loanRepository.save(loan);
    return this.findOne(id);
  }

  /* async remove(id: string): Promise<Loan> {
    const loan = await this.findOne(id);
    return this.loanRepository.softRemove(loan);
  } */
  async remove(id: string): Promise<Loan> {
    const loan = await this.findOne(id);

    // Restaurar stock al eliminar
    for (const item of loan.items) {
      item.game.stockAvailable += item.quantity;
      await this.gameRepository.save(item.game);
    }

    return this.loanRepository.softRemove(loan); // cascade a LoanItems
  }

  async changeStatus(args: LoanChangeStatus): Promise<Loan> {
    const { id, status } = args;

    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['items', 'items.game'],
    });

    if (!loan) throw new NotFoundException('Prestamo no encontrado');

    if (loan.status === LoanStatus.DEVUELTO)
      throw new BadRequestException('El prestamo ya esta devuelto');

    if (status === LoanStatus.DEVUELTO) {
      loan.devolutionDate = new Date();

      for (const item of loan.items) {
        item.game.stockAvailable += item.quantity;
        await this.gameRepository.save(item.game);
      }
    }

    loan.status = status;
    return this.loanRepository.save(loan);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markExpiredLoans() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeLoans = await this.loanRepository.find({
      where: { status: LoanStatus.ACTIVO },
    });

    for (const loan of activeLoans) {
      const endDate = new Date(loan.endDate);
      endDate.setHours(0, 0, 0, 0);

      if (endDate < today) {
        loan.status = LoanStatus.VENCIDO;
        await this.loanRepository.save(loan);
      }
    }
  }
}
