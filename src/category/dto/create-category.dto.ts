import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Smartfonlar', description: 'Kategoriya nomi' })
  @IsString()
  name: string;
}
