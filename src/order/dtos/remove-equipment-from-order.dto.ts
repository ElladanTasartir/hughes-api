import { IsUUID } from 'class-validator';

export class RemoveEquipmentFromOrderDTO {
  @IsUUID()
  id: string;

  @IsUUID()
  equipment_id: string;
}
