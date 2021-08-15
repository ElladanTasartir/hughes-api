import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class StatusQueryDTO {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
