import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OrderModule } from './order/order.module';
import { ormConfig } from './ormconfig';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), OrderModule, PlanModule],
  controllers: [AppController],
})
export class AppModule {}
