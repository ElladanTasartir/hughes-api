import { IsUUID } from 'class-validator';

export class FindPlanDTO {
  @IsUUID()
  id: string;
}
