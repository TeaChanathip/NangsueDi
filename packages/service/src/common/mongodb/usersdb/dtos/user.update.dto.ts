import {
    IsAlpha,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsUrl,
    Validate,
} from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class UserUpdateDto {
    @IsOptional()
    @IsPhoneNumber('TH')
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
