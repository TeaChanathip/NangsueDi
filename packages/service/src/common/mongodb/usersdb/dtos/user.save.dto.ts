import {
    IsAlpha,
    IsEmail,
    IsEnum,
    IsMobilePhone,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    Validate,
} from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { Role } from 'src/shared/enums/role.enum';

export class UserSaveDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsMobilePhone('th-TH', null, {
        message: 'Phone number format is incorrect',
    })
    @Matches(/^0[0-9]*$/, { message: 'Phone number must start with 0' })
    phone: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsAlpha()
    firstName: string;

    @IsOptional()
    @IsAlpha()
    lastName?: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsNotEmpty()
    @Validate(IsUnix)
    registeredAt: number;

    @IsNotEmpty()
    @Validate(IsUnix)
    tokenVersion: number;
}
