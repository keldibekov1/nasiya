import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PartnerRole {
  seller = 'seller',
  customer = 'customer',
}

export class CreatePartnerDto {
  @ApiProperty()
  @IsString()
  fullname: string;


  @ApiProperty({ type: [String], example: ['998901234567', '998901234567'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  phone: string[];

  @ApiProperty()
  @IsString()
  adress: string;

  @ApiProperty({
    type: Object,
    example: { lat: 41.3111, lng: 69.2797 },
  })
  @IsObject()
  @IsOptional()
  location?: { lat: number; lng: number };

  @ApiProperty({ enum: PartnerRole })
  @IsEnum(PartnerRole)
  role: PartnerRole;
}
