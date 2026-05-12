import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryDto {
  @ApiProperty()
  @Expose()
  public id: number;

  @ApiProperty()
  @Expose()
  public name: string;
}
