import { IsUUID } from 'class-validator';

export class FindEquipmentDTO {
  @IsUUID()
  id: string;
}
