import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { planRepository } from './providers/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlanController],
  providers: [PlanService, ...planRepository],
  exports: [...planRepository],
})
export class PlanModule {}
