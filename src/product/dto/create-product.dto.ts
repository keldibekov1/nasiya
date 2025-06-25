import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Samsung s23 ultra', description: 'prdct name' })
  @IsString()
  title: string;


  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty()
  @IsString()
  units: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
}
