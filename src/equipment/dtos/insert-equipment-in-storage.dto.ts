import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class InsertEquipmentInStorageDTO {
  @IsUUID()
  equipment_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}
