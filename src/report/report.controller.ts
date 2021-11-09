import { Controller, Get, Query, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { GetAuthenticatedUser } from 'src/user/decorators/auth.decorator';
import { FindReportDTO } from './dtos/find-report.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReport(
    @GetAuthenticatedUser() _: string,
    @Query(ValidationPipe) findReportDTO: FindReportDTO,
    @Res() res: Response,
  ) {
    const { mimetype, buffer, originalName, size } =
      await this.reportService.getReport(findReportDTO);

    const resHeaders = {
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename=${originalName}`,
      'Content-Length': size,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    };

    res.set(resHeaders);

    res.end(buffer);
  }
}
