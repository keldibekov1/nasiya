import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";

export enum PartnerRole {
    seller = 'seller',
    custumer = 'custumer',
}

export class CreatePartnerDto {
    @ApiProperty()
    @IsString()
    fullname: string;
    
    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    adress: string;


    @ApiProperty({ enum: PartnerRole })
    @IsEnum(PartnerRole)
    role: PartnerRole;
    
}

    
   

