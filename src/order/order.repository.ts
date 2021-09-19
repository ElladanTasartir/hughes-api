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
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createNewOrder(
    { plan_id }: CreateOrderDTO,
    client: Client,
    user_id: string,
  ): Promise<Order> {
    const order = this.orderRepository.create({
      plan_id,
      client,
      status: OrderStatus.OPEN,
      user_id,
    });

    return this.orderRepository.save(order);
  }

  async findOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['client', 'plan'],
    });
  }

  async findOrderByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        status,
      },
      relations: ['client', 'plan_id'],
    });
  }
}
