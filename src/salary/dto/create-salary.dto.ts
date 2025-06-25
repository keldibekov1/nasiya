import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSalaryDto {
  @ApiProperty({
    example: '7d5e0a5b-3e9e-4d9b-9f1d-75dc99db11bb',
  })
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNumber()
  amaunt: number;

  @ApiProperty()
  @IsString()
  comment: string;
}
