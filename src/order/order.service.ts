import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlanRepository } from 'src/plan/plan.repository';
import { UserService } from 'src/user/user.service';
import { removeSpecialCharacters } from 'src/utils/removeSpecialCharacters';
import { ClientRepository } from './client.repository';
import { CreateClientDTO } from './dtos/create-client.dto';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { Client } from './entities/client.entity';
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

  async findOrderByStatus(status: OrderStatus) {
    return this.orderRepository.findOrderByStatus(status);
  }

  async findOrders() {
    return this.orderRepository.findOrders();
  }
}
