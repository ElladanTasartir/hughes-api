import { IsEmail, IsString } from 'class-validator';

export class SignUpUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
