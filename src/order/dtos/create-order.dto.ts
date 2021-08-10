import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { CreateClientDTO } from './create-client.dto';

export class CreateOrderDTO {
  @IsUUID()
  plan_id: string;

  @Type(() => CreateClientDTO)
  @ValidateNested()
  client: CreateClientDTO;
}
