import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInUserDTO } from './dtos/sign-in-user.dto';
import { UserRepository } from './user.repository';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { jwt } from '../config';
import { SignUpUserDTO } from './dtos/sign-up-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: UserRepository,
  ) {}

  async signIn(signInUserDTO: SignInUserDTO) {
    const { email, password } = signInUserDTO;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new UnauthorizedException('Incorrect email/password combination');
    }

    const { secret, expiresIn } = jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return {
      id: user.id,
      token,
    };
  }

  async signUp(signUpUserDTO: SignUpUserDTO): Promise<User> {
    const { email, password } = signUpUserDTO;

    const foundUserByEmail = await this.userRepository.findUserByEmail(email);

    if (foundUserByEmail) {
      throw new BadRequestException(
        `User already registered with email "${email}"`,
      );
    }

    const encryptedPassword = await hash(password, 10);

    return this.userRepository.createUser({
      ...signUpUserDTO,
      password: encryptedPassword,
    });
  }
}
