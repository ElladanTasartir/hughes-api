import { IsString } from 'class-validator';
import { IsMoney } from '@join-com/class-validator-ismoney';

export class CreatePlanDTO {
  @IsString()
  name: string;

  @IsMoney({
    allowNegative: false,
    currencies: ['BRL'],
  })
  price: number;
}
