import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AdminsUnsusUserReqDto {
    @ApiProperty({ default: 'userId' })
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;
}
