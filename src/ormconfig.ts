import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { postgres } from './config';
import { Client } from './order/entities/client.entity';
import { Order } from './order/entities/order.entity';
import { Plan } from './plan/entities/plan.entity';
import { User } from './user/entities/user.entity';

const { host, username, password, database, port, logging, synchronize } =
  postgres;

export const ormConfig = {
  type: 'postgres',
  entities: [Client, Order, Plan, User],
  host: process.env.NODE_ENV !== 'cli' ? host : 'localhost',
  username,
  password,
  database,
  port,
  logging,
  synchronize,
} as TypeOrmModuleOptions;
