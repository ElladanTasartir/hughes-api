import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EquipmentService } from '../equipment/equipment.service';
import { PlanRepository } from '../plan/plan.repository';
import { UserService } from '../user/user.service';
import { removeSpecialCharacters } from '../utils/removeSpecialCharacters';
import { ClientRepository } from './client.repository';
import { CreateClientDTO } from './dtos/create-client.dto';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { RemoveEquipmentFromOrderDTO } from './dtos/remove-equipment-from-order.dto';
import { SetOrderInProgressDTO } from './dtos/set-order-in-progress.dto';
import { Client } from './entities/client.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject('CLIENT_REPOSITORY')
    private readonly clientRepository: ClientRepository,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: OrderRepository,
    @Inject('PLAN_REPOSITORY')
    private readonly planRepository: PlanRepository,
    private readonly mailService: MailerService,
    private readonly userService: UserService,
    private readonly equipmentService: EquipmentService,
  ) {}

  private async createNewClient(
    createClientDTO: CreateClientDTO,
  ): Promise<Client> {
    const { cpf, phone_number } = createClientDTO;

    const formattedCpf = removeSpecialCharacters(cpf);
    const formattedPhoneNumber = removeSpecialCharacters(phone_number);

    return this.clientRepository.createNewClient({
      ...createClientDTO,
      cpf: formattedCpf,
      phone_number: formattedPhoneNumber,
    });
  }

  async createNewOrder(createOrderDTO: CreateOrderDTO) {
    const { plan_id, client } = createOrderDTO;

    const plan = await this.planRepository.findPlanById(plan_id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID "${plan_id}" not found`);
    }

    const users = await this.userService.getUsers();

    if (!users.length) {
      throw new BadRequestException(`No users available to respond to order`);
    }

    const randomIndex = Math.floor(Math.random() * (users.length - 1 - 0) + 0);

    const randomUser = users[randomIndex];

    const newClient = await this.createNewClient(client);

    const createdOrder = await this.orderRepository.createNewOrder(
      createOrderDTO,
      newClient,
      randomUser.id,
    );

    this.mailService.sendMail({
      to: randomUser.email,
      subject: 'Nova ordem de serviço foi criada!',
      template: './neworder',
      context: {
        name: randomUser.name,
        client,
      },
    });

    return createdOrder;
  }

  async updateOrderEquipments(
    id: string,
    setOrderInProgressDTO: SetOrderInProgressDTO,
  ): Promise<Order> {
    const { equipments } = setOrderInProgressDTO;

    const foundOrder = await this.orderRepository.findOneById(id);

    if (!foundOrder) {
      throw new NotFoundException(`Order with ID "${id}" does not exist`);
    }

    if (foundOrder.status !== OrderStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Cannot update an order that's not in progress`,
      );
    }

    if (equipments.length) {
      const foundEquipments = await this.equipmentService.getEquipmentsById(
        equipments.map((equipment) => equipment.equipment_id),
      );

      const uniqueFoundEquipments = foundEquipments.map((equipment) => {
        const firstEquipmentToShow = equipments.find(
          (currentEquipment) => currentEquipment.equipment_id === equipment.id,
        );

        return {
          equipment_id: equipment.id,
          quantity: firstEquipmentToShow.quantity,
        };
      });

      const equipmentsAlreadyInOrder =
        await this.orderRepository.findOrderEquipmentsByEquipmentIdAndOrderId(
          id,
          uniqueFoundEquipments,
        );

      const equipmentsThatAreNotInTheOrder = uniqueFoundEquipments.filter(
        (equipment) => {
          const equipmentExist = equipmentsAlreadyInOrder.find(
            (orderEquipments) =>
              orderEquipments.equipment_id === equipment.equipment_id,
          );

          return !equipmentExist;
        },
      );

      await this.equipmentService.takeFromStorage({
        equipments: equipmentsThatAreNotInTheOrder,
      });

      await this.orderRepository.insertEquipmentsIntoOrderEquipments(
        id,
        equipmentsThatAreNotInTheOrder,
      );
    }

    return this.orderRepository.findOrderById(id);
  }

  async setOrderInProgress(
    id: string,
    setOrderInProgressDTO: SetOrderInProgressDTO,
  ): Promise<Order> {
    const { equipments } = setOrderInProgressDTO;

    const foundOrder = await this.orderRepository.findOneById(id);

    if (!foundOrder) {
      throw new NotFoundException(`Order with ID "${id}" does not exist`);
    }

    if (foundOrder.status !== OrderStatus.OPEN) {
      throw new BadRequestException(
        `Cannot set in progress an order that's already in progress/finished`,
      );
    }

    if (equipments.length) {
      const foundEquipments = await this.equipmentService.getEquipmentsById(
        equipments.map((equipment) => equipment.equipment_id),
      );

      const uniqueFoundEquipments = foundEquipments.map((equipment) => {
        const firstEquipmentToShow = equipments.find(
          (currentEquipment) => currentEquipment.equipment_id === equipment.id,
        );

        return {
          equipment_id: equipment.id,
          quantity: firstEquipmentToShow.quantity,
        };
      });

      const equipmentsAlreadyInOrder =
        await this.orderRepository.findOrderEquipmentsByEquipmentIdAndOrderId(
          id,
          uniqueFoundEquipments,
        );

      if (equipmentsAlreadyInOrder.length) {
        throw new UnprocessableEntityException(
          `Equipments with ID(s) "${equipmentsAlreadyInOrder
            .map((equipment) => equipment.equipment_id)
            .join(',')}" is/are already in order "${id}"`,
        );
      }

      await this.equipmentService.takeFromStorage({
        equipments: uniqueFoundEquipments,
      });

      await this.orderRepository.insertEquipmentsIntoOrderEquipments(
        id,
        uniqueFoundEquipments,
      );
    }

    return this.orderRepository.changeOrderStatus(
      foundOrder,
      OrderStatus.IN_PROGRESS,
    );
  }

  async removeEquipmentFromOrder(
    removeEquipmentFromOrderDTO: RemoveEquipmentFromOrderDTO,
  ): Promise<void> {
    const { id, equipment_id } = removeEquipmentFromOrderDTO;

    const foundOrder = await this.findOrder(id);

    if (!foundOrder) {
      throw new NotFoundException(`Order with ID "${id}" does not exist`);
    }

    const equipmentExists = await this.equipmentService.getEquipmentById(
      equipment_id,
    );

    if (!equipmentExists) {
      throw new NotFoundException(
        `Equipment with ID "${equipment_id}" does not exist`,
      );
    }

    const foundOrderEquipment = await this.orderRepository.findOrderEquipment(
      id,
      equipment_id,
    );

    if (!foundOrderEquipment) {
      throw new NotFoundException(
        `Equipment with ID "${equipment_id}" does not exist in order with ID "${id}"`,
      );
    }

    await this.equipmentService.replenishStorage(
      equipment_id,
      foundOrderEquipment.quantity,
    );

    await this.orderRepository.removeEquipmentFromOrder(id, equipment_id);
  }

  async setOrderComplete(id: string): Promise<Order> {
    const foundOrder = await this.orderRepository.findOneById(id);

    if (!foundOrder) {
      throw new NotFoundException(`Order with ID "${id}" does not exist`);
    }

    return this.orderRepository.changeOrderStatus(
      foundOrder,
      OrderStatus.FINISHED,
    );
  }

  findOrderByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepository.findOrderByStatus(status);
  }

  findOrders(): Promise<Order[]> {
    return this.orderRepository.findOrders();
  }

  findOrder(id: string): Promise<Order> {
    return this.orderRepository.findOrderById(id);
  }
}
