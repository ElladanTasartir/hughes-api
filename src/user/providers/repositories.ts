import { Provider } from '@nestjs/common';
import { UserRepository } from '../user.repository';

export const userRepositories = [
  {
    provide: 'USER_REPOSITORY',
    useClass: UserRepository,
  },
] as Provider[];
