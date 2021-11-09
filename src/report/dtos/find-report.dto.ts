import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FindReportDTO {
  @Type(() => Number)
  @IsInt()
  month: number;

  @Type(() => Number)
  @IsInt()
  year: number;
}
