import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderEquipmentDTO } from './dtos/order-equipment.dto';
import { Client } from './entities/client.entity';
import { Order } from './entities/order.entity';
import { OrderEquipments } from './entities/order_equipment.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderEquipments)
    private readonly orderEquipmentsRepository: Repository<OrderEquipments>,
  ) {}

  async removeEquipmentFromOrder(
    id: string,
    equipment_id: string,
  ): Promise<void> {
    await this.orderEquipmentsRepository.delete({
      order_id: id,
      equipment_id,
    });
  }

  async findOrderEquipment(
    id: string,
    equipment_id: string,
  ): Promise<OrderEquipments> {
    return this.orderEquipmentsRepository.findOne({
      where: {
        order_id: id,
        equipment_id,
      },
    });
  }

  async findOrderByMonthAndYear(
    initialDate: Date,
    finalDate: Date,
  ): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        updated_at: Between(initialDate, finalDate),
      },
      relations: ['plan', 'client'],
    });
  }

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

  async insertEquipmentsIntoOrderEquipments(
    id: string,
    orderEquipments: OrderEquipmentDTO[],
  ): Promise<void> {
    const orderEquipmentsWithOrderId = orderEquipments.map(
      (orderEquipment) => ({
        ...orderEquipment,
        order_id: id,
      }),
    );

    await this.orderEquipmentsRepository.insert(orderEquipmentsWithOrderId);
  }

  async changeOrderStatus(
    order: Order,
    orderStatus: OrderStatus,
  ): Promise<Order> {
    order.status = orderStatus;

    await this.orderRepository.save(order);

    return this.findOrderById(order.id);
  }

  async findOrders(): Promise<Order[]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    return queryBuilder
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.plan', 'plan')
      .leftJoinAndSelect('order.order_equipments', 'order_equipments')
      .leftJoinAndSelect('order_equipments.equipment', 'equipment')
      .getMany();
  }

  findOrderById(id: string): Promise<Order> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    return queryBuilder
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.plan', 'plan')
      .leftJoinAndSelect('order.order_equipments', 'order_equipments')
      .leftJoinAndSelect('order_equipments.equipment', 'equipment')
      .where('order.id = :id', { id })
      .getOne();
  }

  findOrderEquipmentsByEquipmentIdAndOrderId(
    id: string,
    orderEquipments: OrderEquipmentDTO[],
  ): Promise<OrderEquipments[]> {
    const equipmentIds = orderEquipments.map(
      (orderEquipment) => orderEquipment.equipment_id,
    );

    return this.orderEquipmentsRepository.find({
      where: {
        equipment_id: In(equipmentIds),
        order_id: id,
      },
    });
  }

  findOneById(id: string): Promise<Order> {
    return this.orderRepository.findOne(id);
  }

  async findOrderByStatus(status: OrderStatus): Promise<Order[]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    return queryBuilder
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.plan', 'plan')
      .leftJoinAndSelect('order.order_equipments', 'order_equipments')
      .leftJoinAndSelect('order_equipments.equipment', 'equipment')
      .where('order.status = :status', { status })
      .getMany();
  }

  async updateOrderEquipmentsInOrder(
    id: string,
    orderEquipments: OrderEquipmentDTO[],
  ): Promise<Order> {
    await this.insertEquipmentsIntoOrderEquipments(id, orderEquipments);

    return this.findOrderById(id);
  }
}
