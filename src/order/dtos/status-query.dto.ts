import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class StatusQueryDTO {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
