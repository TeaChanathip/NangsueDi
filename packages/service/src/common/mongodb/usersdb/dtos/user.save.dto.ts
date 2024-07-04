import { IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUnix } from '../../../validators/isUnix.validator';
import { Role } from '../../../../shared/enums/role.enum';

export class UserSaveDto {
    email: string;
    phone: string;
    firstName: string;
    lastName?: string;
    birthTime: number;

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
