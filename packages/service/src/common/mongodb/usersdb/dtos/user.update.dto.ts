import { IsNotEmpty, Validate } from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class UserUpdateDto {
    phone?: string;
    firstName?: string;
    lastName?: string;
    avartarUrl?: string;

    @IsNotEmpty()
    @Validate(IsUnix)
    updatedAt: number;
}
