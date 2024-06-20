import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlpha,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsUrl,
} from 'class-validator';

export class UserEditDto {
    @ApiProperty({
        default: '+66 991111111',
    })
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiProperty({
        default: 'fupdatedone',
    })
    @IsOptional()
    @IsAlpha()
    firstName?: string;

    @ApiProperty({
        default: 'lupdatedone',
    })
    @IsOptional()
    @IsAlpha()
    lastName?: string;

    @ApiProperty({
        default:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Advanced_Info_Service_logo.svg/1280px-Advanced_Info_Service_logo.svg.png',
    })
    @IsOptional()
    @IsUrl()
    avartarUrl?: string;
}

export class UserEditPayload extends UserEditDto {
    @IsNotEmpty()
    @IsNumber()
    updatedAt: number;
}
