import { PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsBoolean()
  pin?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isArchive?: boolean;
}
