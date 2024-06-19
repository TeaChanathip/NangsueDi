import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRegisterDto } from 'src/modules/users/dtos/user-register.dto';
import { Roles } from 'src/shared/enums/roles.enum';

export class UserSaveDto extends UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(Roles)
    role: Roles;

    @IsNotEmpty()
    @IsNumber()
    registeredAt: number;
}
