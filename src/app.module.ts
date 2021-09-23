import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { EquipmentModule } from './equipment/equipment.module';
import { OrderModule } from './order/order.module';
import { ormConfig } from './ormconfig';
import { PlanModule } from './plan/plan.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    OrderModule,
    PlanModule,
    UserModule,
    EquipmentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
