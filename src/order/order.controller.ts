import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetAuthenticatedUser } from 'src/user/decorators/auth.decorator';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { FindOrderByIdDTO } from './dtos/find-order-by-id.dto';
import { SetOrderInProgressDTO } from './dtos/set-order-in-progress.dto';
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

  @Post(':id/progress')
  @UsePipes(new ValidationPipe({ transform: true }))
  setOrderInProgress(
    @Param() findOrderByIdDTO: FindOrderByIdDTO,
    @Body() setOrderInProgressDTO: SetOrderInProgressDTO,
    @GetAuthenticatedUser() _: string,
  ): Promise<Order> {
    return this.orderService.setOrderInProgress(
      findOrderByIdDTO.id,
      setOrderInProgressDTO,
    );
  }

  @Get()
  findOrders(
    @Query(ValidationPipe) statusQueryDTO: StatusQueryDTO,
    @GetAuthenticatedUser() _: string,
  ): Promise<Order[]> {
    const { status } = statusQueryDTO;

    if (status) {
      return this.orderService.findOrderByStatus(status);
    }

    return this.orderService.findOrders();
  }
}
