import { Provider } from '@nestjs/common';
import { ClientRepository } from '../client.repository';
import { OrderRepository } from '../order.repository';

export const orderRepositories = [
  {
    provide: 'CLIENT_REPOSITORY',
    useClass: ClientRepository,
  },
  {
    provide: 'ORDER_REPOSITORY',
    useClass: OrderRepository,
  },
] as Provider[];
