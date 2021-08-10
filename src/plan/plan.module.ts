import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { planRepository } from './providers/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  providers: [...planRepository],
  exports: [...planRepository],
})
export class PlanModule {}
