import { IsCurrency, IsOptional, IsString } from 'class-validator';
export class UpdatePlanDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsCurrency({
    symbol: 'R$',
    require_symbol: false,
    allow_decimal: true,
    allow_negatives: false,
    digits_after_decimal: [2],
  })
  @IsOptional()
  price?: string;
}
