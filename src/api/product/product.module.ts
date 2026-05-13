import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Category } from '../../database/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../../database/entities/user.entity';
import { Product } from 'src/database/entities/product.entity';
import { ProductListener } from './listeners/product.listener';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Category]), UserModule],
  controllers: [ProductController],
  providers: [ProductService, ProductListener],
})
export class ProductModule {}
