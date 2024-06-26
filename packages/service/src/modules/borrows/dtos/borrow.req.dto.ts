import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class BorrowReqDto {
    @ApiProperty({ type: Number, required: true, default: 1 })
    @IsInt()
    @Min(1)
    @Max(2)
    amount: number;
}
