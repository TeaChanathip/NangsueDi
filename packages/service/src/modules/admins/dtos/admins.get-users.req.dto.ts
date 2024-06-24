import {
    IsBoolean,
    IsEnum,
    IsMongoId,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { Role } from 'src/shared/enums/role.enum';

class PermsOptions {
    @IsOptional()
    @IsBoolean()
    canBorrow?: boolean;

    @IsOptional()
    @IsBoolean()
    canReview?: boolean;
}

export class AdminGetUsersReqDto {
    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEnum(Role, { each: true })
    roles?: Role[];

    @IsOptional()
    @IsMongoId()
    permissions?: PermsOptions;

    @IsOptional()
    @Validate(IsUnix)
    registeredBegin?: number;

    @IsOptional()
    @Validate(IsUnix)
    registeredEnd?: number;

    @IsOptional()
    @Validate(IsUnix)
    updatedBegin?: number;

    @IsOptional()
    @Validate(IsUnix)
    updatedEnd?: number;

    @IsOptional()
    @Validate(IsUnix)
    suspendedBegin?: number;

    @IsOptional()
    @Validate(IsUnix)
    suspendedEnd?: number;
}
