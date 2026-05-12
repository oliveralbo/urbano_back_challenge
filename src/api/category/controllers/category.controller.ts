import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { Serialize } from 'src/common/helper/serialize.interceptor';
import { CategoryDto } from '../dto/category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({ type: [CategoryDto] })
  @Serialize(CategoryDto)
  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }
}
