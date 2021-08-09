import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { Client } from './entities/client.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createNewOrder(
    { plan_id }: CreateOrderDTO,
    client: Client,
  ): Promise<Order> {
    const order = this.orderRepository.create({
      plan_id,
      client_id: client.id,
      status: OrderStatus.OPEN,
    });

    return this.orderRepository.save(order);
  }
}
