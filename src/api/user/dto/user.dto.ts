import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UserDto {
  @ApiProperty()
  @Expose()
  public id: number;

  @ApiProperty()
  @Expose()
  public email: string;
}
