import { IsInt, Min } from 'class-validator';

export class UpdateStoragedQuantityDTO {
  @IsInt()
  @Min(0)
  quantity: number;
}
