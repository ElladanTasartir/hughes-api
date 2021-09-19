import { IsCurrency, IsString } from 'class-validator';
export class CreatePlanDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsCurrency({
    symbol: 'R$',
    require_symbol: false,
    allow_decimal: true,
    allow_negatives: false,
    digits_after_decimal: [2],
  })
  price: string;
}
