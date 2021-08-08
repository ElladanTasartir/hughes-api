import { Client } from './order/entities/client.entity';
import { Order } from './order/entities/order.entity';
import { ormConfig } from './ormconfig';

export default {
  ...ormConfig,
  entities: [Order, Client],
  migrations: ['migrations/*.ts'],
  migrationRun: false,
  cli: {
    migrationsDir: 'migrations',
  },
};
