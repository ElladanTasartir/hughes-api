import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { StatusQueryDTO } from './dtos/status-query.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createNewOrder(@Body() createOrderDTO: CreateOrderDTO): Promise<Order> {
    return this.orderService.createNewOrder(createOrderDTO);
  }

  @Get()
  findOrders(
    @Query(ValidationPipe) statusQueryDTO: StatusQueryDTO,
  ): Promise<Order[]> {
    const { status } = statusQueryDTO;

    if (status) {
      return this.orderService.findOrderByStatus(status);
    }

    return this.orderService.findOrders();
  }
}
