import { Inject, Injectable } from '@nestjs/common';
import ReactPDF from '@react-pdf/renderer';
import * as dayjs from 'dayjs';
import { OrderStatus } from 'src/order/enums/order-status.enum';
import { OrderRepository } from 'src/order/order.repository';
import { Report } from './components/report.component';
import { FindReportDTO } from './dtos/find-report.dto';

@Injectable()
export class ReportService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: OrderRepository,
  ) {}

  async getReport(findReportDTO: FindReportDTO) {
    const { month, year } = findReportDTO;

    const initialDate = dayjs(new Date())
      .set('year', year)
      .set('month', month - 1)
      .set('date', 1)
      .toDate();

    const finalDate = dayjs(new Date())
      .set('year', year)
      .set('month', month - 1)
      .endOf('month')
      .toDate();

    const ordersInMonth = await this.orderRepository.findOrderByMonthAndYear(
      initialDate,
      finalDate,
    );

    const finishedOrdersInMonth = ordersInMonth.filter(
      (order) => order.status === OrderStatus.FINISHED,
    );

    const reportProps = {
      finishedOrders: finishedOrdersInMonth.length,
      orders: ordersInMonth,
    };

    const fileStream = await ReactPDF.renderToStream(
      <Report {...reportProps} />,
    );

    const file = await new Promise<Buffer>((resolve) => {
      const fileChunks = [];
      fileStream
        .on('data', (chunk) => {
          fileChunks.push(chunk);
        })
        .on('end', () => {
          resolve(Buffer.concat(fileChunks));
        });
    });

    const date = dayjs().format('YYYY-MM-DD');

    return {
      mimetype: 'application/pdf',
      size: file.length,
      buffer: file,
      originalName: `[${date}]-orders-${month}-${year}.pdf`,
    };
  }
}
