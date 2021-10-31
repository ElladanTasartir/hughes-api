import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrderEquipmentDTO } from './order-equipment.dto';

export class UpdateOrderDTO {
  @IsArray()
  @Type(() => OrderEquipmentDTO)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  equipments: OrderEquipmentDTO[];
}
