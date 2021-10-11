import { IsCurrency, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateEquipmentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsCurrency({
    symbol: 'R$',
    require_symbol: false,
    allow_decimal: true,
    allow_negatives: false,
    digits_after_decimal: [2],
  })
  @IsNotEmpty()
  price: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
