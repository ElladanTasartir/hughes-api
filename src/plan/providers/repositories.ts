import { Provider } from '@nestjs/common';
import { PlanRepository } from '../plan.repository';

export const planRepository = [
  {
    provide: 'PLAN_REPOSITORY',
    useClass: PlanRepository,
  },
] as Provider[];
