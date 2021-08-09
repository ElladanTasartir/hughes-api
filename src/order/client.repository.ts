import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDTO } from './dtos/create-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
  ) {}

  async createNewClient(createClientDTO: CreateClientDTO): Promise<Client> {
    const createdClient = this.repository.create(createClientDTO);

    return this.repository.save(createdClient);
  }
}
