import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Categories } from '../../../../database/entities/category.enum';

export class ComputerDetails {
  @ApiProperty({ enum: [Categories.Computers] })
  @IsString()
  @IsNotEmpty()
  category = Categories.Computers;

  @ApiProperty({ example: 512 })
  @IsNumber()
  capacity: number;

  @ApiProperty({ enum: ['GB', 'TB'], example: 'GB' })
  @IsString()
  @IsIn(['GB', 'TB'])
  capacityUnit: 'GB' | 'TB';

  @ApiProperty({ enum: ['SSD', 'HD'], example: 'SSD' })
  @IsString()
  @IsIn(['SSD', 'HD'])
  capacityType: 'SSD' | 'HD';

  @ApiProperty({ example: 'Dell' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Inspirion' })
  @IsString()
  @IsNotEmpty()
  series: string;
}
