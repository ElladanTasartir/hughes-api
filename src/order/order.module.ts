import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanModule } from 'src/plan/plan.module';
import { Client } from './entities/client.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { orderRepositories } from './providers/repositories';
import { mail } from '../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Order]),
    MailerModule.forRoot({
      defaults: {
        from: '"No Reply" <noreply@hughes.com>',
      },
      transport: {
        host: 'smtp.gmail.com',
        service: 'Gmail',
        auth: {
          user: mail.email,
          pass: mail.pass,
        },
      },
      template: {
        dir: resolve(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    PlanModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, ...orderRepositories],
})
export class OrderModule {}
