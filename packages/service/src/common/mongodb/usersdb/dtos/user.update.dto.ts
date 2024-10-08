import { IsNotEmpty, Validate } from 'class-validator';
import { IsUnix } from '../../../validators/isUnix.validator';

export class UserUpdateDto {
    phone?: string;
    firstName?: string;
    lastName?: string;
    birthTime?: number;
    avartarUrl?: string;

    @IsNotEmpty()
    @Validate(IsUnix)
    updatedAt: number;
}
