import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanModule } from 'src/plan/plan.module';
import { Client } from './entities/client.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { orderRepositories } from './providers/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Order]), PlanModule],
  controllers: [OrderController],
  providers: [OrderService, ...orderRepositories],
})
export class OrderModule {}
