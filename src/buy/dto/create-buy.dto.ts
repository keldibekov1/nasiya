import { IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBuyDto {
  @ApiProperty({
    example: '7d5e0a5b-3e9e-4d9b-9f1d-75dc99db11bb',
    description: 'partner ID',
  })
  @IsUUID()
  partnerId: string;

  @ApiPropertyOptional({
    example: '3fcd7151-9c47-437b-9008-ff14fd2c5db1',
    description: 'Agar mavjud mahsulotdan bolsa, productId yuboriladi',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({
    example: 10,
    description: 'Sotib olinayotgan miqdor (dona)',
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: 15000,
    description: 'Bir donasining sotib olish narxi',
  })
  @IsNumber()
  buyPrice: number;

  @ApiPropertyOptional({
    example: 'sifatli',
    description: 'izoh',
  })
  @IsOptional()
  @IsString()
  comment?: string;


  @ApiPropertyOptional({
    example: 'nimadir product ',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'd58efbe4-3b7f-4f10-b07e-2c362e8d9dd3',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'dona',
    description: 'Mahsulot birligi, masalan: dona',
  })
  @IsOptional()
  @IsString()
  units?: string;
}
