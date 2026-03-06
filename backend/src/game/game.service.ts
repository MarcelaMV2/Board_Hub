import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const { idCategory, ...gameData } = createGameInput;

    if (createGameInput.maxPlayers < createGameInput.minPlayers) {
      throw new BadRequestException(
        'La cantidad maxima de jugadores debe de ser mayor a la cantidad minima',
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { id: idCategory },
    });

    if (!category) throw new NotFoundException('No existe categoria');
    // const newGame = this.gameRepository.create(createGameInput);
    const newGame = this.gameRepository.create({ ...gameData, category });
    newGame.stockAvailable = newGame.stockTotal;

    return await this.gameRepository.save(newGame);
  }

  async findAll(): Promise<Game[]> {
    return await this.gameRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gameRepository.findOneBy({ id });
    if (!game) throw new NotFoundException('El juego no esta registrado');
    return game;
  }

  async update(id: string, updateGameInput: UpdateGameInput): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!game) throw new NotFoundException('El juego no esta registrado');

    if (
      updateGameInput.stockTotal !== undefined &&
      updateGameInput.stockTotal !== game.stockTotal
    ) {
      const prestados = game.stockTotal - game.stockAvailable;
      game.stockAvailable = Math.max(0, updateGameInput.stockTotal - prestados);
    }

    Object.assign(game, updateGameInput);
    return this.gameRepository.save(game);
  }

  async remove(id: string): Promise<Game> {
    const game = await this.findOne(id);
    return this.gameRepository.softRemove(game);
  }
}
