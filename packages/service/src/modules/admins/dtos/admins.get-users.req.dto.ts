import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
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
    @ApiProperty({ default: 'test', required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ default: '09', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ default: 'test', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ default: 'test', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({
        enum: Role,
        isArray: true,
        default: [Role.USER],
        required: false,
    })
    @IsOptional()
    @IsEnum(Role, { each: true })
    roles?: Role | Role[];

    @ApiProperty({
        default: { canBorrow: true, canReview: true } as PermsOptions,
        required: false,
    })
    @IsOptional()
    permissions?: PermsOptions;

    @ApiProperty({ default: 0, required: false })
    @IsOptional()
    @Validate(IsUnix)
    registeredBegin?: number;

    @ApiProperty({ default: 2147483647, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    registeredEnd?: number;

    @ApiProperty({ default: 0, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    updatedBegin?: number;

    @ApiProperty({ default: 2147483647, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    updatedEnd?: number;

    @ApiProperty({ default: 0, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    suspendedBegin?: number;

    @ApiProperty({ default: 2147483647, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    suspendedEnd?: number;
}
