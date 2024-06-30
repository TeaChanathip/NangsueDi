import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class ActionsBorrowsReqDto {
    @ApiProperty({
        type: Types.ObjectId,
        required: true,
        default: 'addrId',
    })
    @IsNotEmpty()
    @IsMongoId()
    addrId: Types.ObjectId;
}
