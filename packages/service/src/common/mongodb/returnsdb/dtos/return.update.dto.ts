import { IsOptional, IsString } from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class ReturnUpdateDto {
    @IsOptional()
    @IsUnix()
    approvedAt?: number;

    @IsOptional()
    @IsUnix()
    rejectedAt?: number;

    @IsOptional()
    @IsString()
    rejectReason?: string;
}
