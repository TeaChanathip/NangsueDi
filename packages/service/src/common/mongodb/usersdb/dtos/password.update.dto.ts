import {
    IsNotEmpty,
    IsNumber,
    IsString,
    MIN_LENGTH,
    MaxLength,
    MinLength,
    Validate,
} from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class PasswordUpdateDto {
    password: string;

    @IsNotEmpty()
    @Validate(IsUnix)
    tokenVersion: number;
}
