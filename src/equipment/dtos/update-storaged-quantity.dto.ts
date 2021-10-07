import { IsInt, IsPositive } from 'class-validator';

export class UpdateStoragedQuantityDTO {
  @IsInt()
  @IsPositive()
  quantity: number;
}
