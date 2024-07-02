import { IsOptional } from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class BorrowUpdateDto {
    @IsOptional()
    @IsUnix()
    approvedAt?: number;

    @IsOptional()
    @IsUnix()
    rejectedAt?: number;
}
