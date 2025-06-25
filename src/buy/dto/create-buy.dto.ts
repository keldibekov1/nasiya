import { IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuyDto {
  @ApiProperty({
    example: '7d5e0a5b-3e9e-4d9b-9f1d-75dc99db11bb',
  })
  @IsUUID()
  partnerId: string;

  @ApiProperty({
    example: '3fcd7151-9c47-437b-9008-ff14fd2c5db1',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    example: 10,
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: 15000.5,
  })
  @IsNumber()
  buyPrice: number;

@ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;
}
