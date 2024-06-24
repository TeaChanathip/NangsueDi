import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UserPermsSaveDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @IsNotEmpty()
    @IsBoolean()
    canBorrow: boolean;

    @IsNotEmpty()
    @IsBoolean()
    canReview: boolean;
}
