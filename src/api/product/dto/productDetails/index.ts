import { TypeHelpOptions } from 'class-transformer';
import { Categories } from 'src/database/entities/category.enum';
import { ComputerDetails } from './computer.details';
import { TestDetails } from './test.details';
import { BaseDetails } from './base.details';

export type ProductDetails = ComputerDetails | TestDetails | BaseDetails;

export function ProductDetailsTypeFn(options: TypeHelpOptions) {
  switch (options.object?.details?.category) {
    case Categories.Computers:
      return ComputerDetails;
    case 'Test':
      return TestDetails;
    default:
      return BaseDetails;
  }
}
