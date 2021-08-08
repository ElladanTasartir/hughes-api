import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
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
}
