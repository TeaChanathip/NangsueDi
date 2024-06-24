import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class PasswordUpdateDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @Validate(IsUnix)
    tokenVersion: number;
}
