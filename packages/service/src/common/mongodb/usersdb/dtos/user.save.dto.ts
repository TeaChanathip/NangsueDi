import { IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { Role } from 'src/shared/enums/role.enum';

export class UserSaveDto {
    email: string;
    phone: string;
    firstName: string;
    lastName?: string;
    addresses: Types.ObjectId[];

    // hashed password
    @IsNotEmpty()
    @IsString()
    password: string;

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
