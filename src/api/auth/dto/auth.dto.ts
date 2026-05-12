import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/api/user/dto/user.dto';

export class PayloadDto {
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public id: number;
}

export class LoginResponseDto {
  @ApiProperty()
  @Expose()
  public accessToken: string;

  @ApiProperty({ type: UserDto })
  @Expose()
  @Type(() => UserDto)
  public user: UserDto;
}
