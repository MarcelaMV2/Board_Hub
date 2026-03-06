import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientInput: CreateClientInput): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: [
        { email: createClientInput.email },
        { telefono: createClientInput.telefono },
      ],
    });

    if (client) {
      if (client.email === createClientInput.email) {
        throw new ConflictException('El correo ya esta registrado');
      }

      if (client.telefono === createClientInput.telefono) {
        throw new ConflictException('El telefono ya esta registrado');
      }
    }

    const newClient = this.clientRepository.create(createClientInput);

    return await this.clientRepository.save(newClient);
  }

  async findAll(): Promise<Client[]> {
    const clients = await this.clientRepository
      .createQueryBuilder('client')
      .loadRelationCountAndMap('client.totalLoans', 'client.loans')
      .leftJoinAndSelect(
        'client.loans',
        'loan',
        'loan.status = :status AND loan.delete_date IS NULL',
        { status: 'ACTIVO' },
      )
      .leftJoinAndSelect('loan.items', 'item')
      .getMany();

    return clients.map((client: any) => {
      const activeGames = (client.loans ?? []).reduce(
        (sum: number, loan: any) =>
          sum +
          (loan.items ?? []).reduce(
            (s: number, item: any) => s + item.quantity,
            0,
          ),
        0,
      );
      client.activeLoans = activeGames;
      return client;
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client)
      throw new NotFoundException('El cliente no se encuentra registrado');
    return client;
  }

  async update(
    id: string,
    updateClientInput: UpdateClientInput,
  ): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientInput);
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<Client> {
    const client = await this.findOne(id);
    return this.clientRepository.softRemove(client);
  }
}
