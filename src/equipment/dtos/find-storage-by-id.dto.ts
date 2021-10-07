import { IsUUID } from 'class-validator';

export class FindStorageByIdDTO {
  @IsUUID()
  id: string;
}
