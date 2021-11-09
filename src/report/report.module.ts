import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [OrderModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
