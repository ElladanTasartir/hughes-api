import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanDTO } from './dtos/create-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  findPlanById(id: string): Promise<Plan | undefined> {
    return this.planRepository.findOne({
      where: {
        id,
      },
    });
  }

  findPlans(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  findPlanByName(name: string): Promise<Plan> {
    return this.planRepository.findOne({
      where: {
        name,
      },
    });
  }

  createPlan(createPlanDTO: CreatePlanDTO): Promise<Plan> {
    const createdPlan = this.planRepository.create(createPlanDTO);

    return this.planRepository.save(createdPlan);
  }
}
