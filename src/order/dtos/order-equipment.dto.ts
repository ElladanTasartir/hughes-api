import { IsInt, IsUUID, Min } from 'class-validator';

export class OrderEquipmentDTO {
  @IsUUID()
  equipment_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
