import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum Pmnt {
  in = 'in',
  out = 'out',
}
export class CreatePaymentDto {
  @ApiProperty({
    example: '7d5e0a5b-3e9e-4d9b-9f1d-75dc99db11bb',
  })
  @IsUUID()
  partnerId: string;

  @ApiProperty({
    example: '3fcd7151-9c47-437b-9008-ff14fd2c5db1',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  debtId?: string;

  @ApiProperty({ example: 'izoh', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    example: 10000,
  })
  @IsNumber()
  amaunt: number;
  @ApiProperty({
    example: 'in',
    enum: Pmnt,
  })
  @IsEnum(Pmnt)
  paymentType: Pmnt;
}
