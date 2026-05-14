import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { variationTypesKeys } from 'src/database/entities/product.entity';
import { ProductDetails, ProductDetailsTypeFn } from './productDetails';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  @IsNumber()
  @IsNotEmpty()
  public categoryId: number;
}

export class ProductDetailsDto {
  @ApiProperty({ example: 'Smartphone X' })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ example: 'SM-X123' })
  @IsString()
  @IsNotEmpty()
  public code: string;

  @ApiProperty({
    enum: variationTypesKeys,
    example: 'NONE',
    description: 'Tipo de variación del producto',
  })
  @IsDefined()
  @IsString()
  @IsIn(variationTypesKeys)
  public variationType: string;

  @ApiProperty({ description: 'Detalles específicos según la categoría' })
  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  public details: ProductDetails;

  @ApiProperty({ example: ['Característica 1', 'Característica 2'] })
  @ArrayMinSize(1)
  @IsString({ each: true })
  public about: string[];

  @ApiProperty({ example: 'Una descripción detallada del producto.' })
  @IsString()
  @IsNotEmpty()
  public description: string;
}

export class ProductDto {
  @ApiProperty()
  @Expose()
  public id: number;

  @ApiProperty()
  @Expose()
  public code: string;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty()
  @Expose()
  public variationType: string;

  @ApiProperty()
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public about: string[];

  @ApiProperty()
  @Expose()
  public details: any;

  @ApiProperty()
  @Expose()
  public isActive: boolean;

  @ApiProperty()
  @Expose()
  public merchantId: number;

  @ApiProperty()
  @Expose()
  public categoryId: number;
}
