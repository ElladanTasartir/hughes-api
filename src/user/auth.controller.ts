import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDTO } from './dtos/sign-in-user.dto';
import { SignUpUserDTO } from './dtos/sign-up-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn(@Body(ValidationPipe) signInUserDTO: SignInUserDTO) {
    return this.authService.signIn(signInUserDTO);
  }

  @Post('/signup')
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(@Body(ValidationPipe) signUpUserDTO: SignUpUserDTO) {
    return this.authService.signUp(signUpUserDTO);
  }
}
