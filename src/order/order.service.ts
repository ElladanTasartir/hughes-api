import { Inject, Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject('CLIENT_REPOSITORY')
    private readonly clientRepository: ClientRepository,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: OrderRepository,
  ) {}

  async createNewOrder(createOrderDTO: CreateOrderDTO) {
    const newClient = await this.clientRepository.createNewClient(
      createOrderDTO.client,
    );

    return this.orderRepository.createNewOrder(createOrderDTO, newClient);
  }
}
