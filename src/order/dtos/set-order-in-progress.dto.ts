import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { OrderEquipmentDTO } from './order-equipment.dto';

export class SetOrderInProgressDTO {
  @IsArray()
  @Type(() => OrderEquipmentDTO)
  @ValidateNested({ each: true })
  equipments: OrderEquipmentDTO[];
}
