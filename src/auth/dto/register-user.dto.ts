import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
