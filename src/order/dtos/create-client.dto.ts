import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateClientDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(
    /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/,
  )
  cpf: string;

  @IsNotEmpty()
  @IsLatitude()
  latitude: string;

  @IsNotEmpty()
  @IsLongitude()
  longitude: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone_number: string;
}
