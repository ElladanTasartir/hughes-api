import { IsUUID } from 'class-validator';

export class FindOrderByIdDTO {
  @IsUUID()
  id: string;
}
