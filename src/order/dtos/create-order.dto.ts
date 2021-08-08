import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateClientDTO } from './create-client.dto';

export class CreateOrderDTO {
  plan_id?: string;

  @Type(() => CreateClientDTO)
  @ValidateNested()
  client: CreateClientDTO;
}
