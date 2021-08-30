import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpUserDTO } from './dtos/sign-up-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  createUser(signUpUserDTO: SignUpUserDTO): Promise<User> {
    const user = this.userRepository.create(signUpUserDTO);

    return this.userRepository.save(user);
  }
}
