import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRepository } from './client.repository';
import { Client } from './entities/client.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Order])],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'CLIENT_REPOSITORY',
      useClass: ClientRepository,
    },
    {
      provide: 'ORDER_REPOSITORY',
      useClass: OrderRepository,
    },
  ],
})
export class OrderModule {}
