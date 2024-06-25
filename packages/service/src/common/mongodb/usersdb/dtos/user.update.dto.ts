import {
    IsAlpha,
    IsMobilePhone,
    IsNotEmpty,
    IsOptional,
    IsUrl,
    Matches,
    Validate,
} from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class UserUpdateDto {
    @IsMobilePhone('th-TH', null, {
        message: 'Phone number format is incorrect',
    })
    @Matches(/^0[0-9]*$/, { message: 'Phone number must start with 0' })
    phone?: string;

    @IsOptional()
    @IsAlpha()
    firstName?: string;

    @IsOptional()
    @IsAlpha()
    lastName?: string;

    @IsOptional()
    @IsUrl()
    avartarUrl?: string;

    @IsNotEmpty()
    @Validate(IsUnix)
    updatedAt: number;
}
