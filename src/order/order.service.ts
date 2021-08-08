import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private clientRepository: ClientRepository,
    private orderRepository: OrderRepository,
  ) {}

  async createNewOrder(createOrderDTO: CreateOrderDTO) {
    const newClient = await this.clientRepository.createNewClient(
      createOrderDTO.client,
    );

    return this.orderRepository.createNewOrder(createOrderDTO, newClient);
  }
}
