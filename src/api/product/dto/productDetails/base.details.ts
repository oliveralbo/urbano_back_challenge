import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseDetails {
  @ApiProperty({ example: 'General' })
  @IsString()
  @IsNotEmpty()
  category: string;
}
