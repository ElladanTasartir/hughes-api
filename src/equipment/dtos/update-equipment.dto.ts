import { IsCurrency, IsOptional, IsString } from 'class-validator';

export class UpdateEquipmentDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  manufacturer: string;

  @IsCurrency({
    symbol: 'R$',
    require_symbol: false,
    allow_decimal: true,
    allow_negatives: false,
    digits_after_decimal: [2],
  })
  @IsOptional()
  price: string;
}
