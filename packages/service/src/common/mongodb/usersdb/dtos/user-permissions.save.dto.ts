import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UserPermsSaveDto {
    @IsNotEmpty()
    userId: Types.ObjectId;

    @IsNotEmpty()
    @IsBoolean()
    canBorrow: boolean;

    @IsNotEmpty()
    @IsBoolean()
    canReview: boolean;
}
