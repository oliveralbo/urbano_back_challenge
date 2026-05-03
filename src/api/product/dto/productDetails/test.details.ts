import { ApiProperty } from '@nestjs/swagger';

export class TestDetails {
  @ApiProperty({ example: 'Test' })
  category = 'Test';

  @ApiProperty({ example: true })
  test: boolean;
}
