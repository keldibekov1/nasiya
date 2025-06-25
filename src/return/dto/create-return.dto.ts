import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateReturnDto {
  @ApiProperty({
    example: '7d5e0a5b-3e9e-4d9b-9f1d-75dc99db11bb',
  })
  @IsUUID()
  contractId: string;

  @ApiProperty()
   @IsString()
  reason: string;

  @ApiProperty()
  @IsBoolean()
  isNew: boolean;
}
