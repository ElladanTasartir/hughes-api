import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { OrderModule } from './order/order.module';
import { ormConfig } from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), OrderModule],
  controllers: [AppController],
})
export class AppModule {}
