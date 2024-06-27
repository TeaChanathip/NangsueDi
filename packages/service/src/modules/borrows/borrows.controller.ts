import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RequestHeader } from 'src/shared/interfaces/request-header.interface';
import { BorrowsService } from './borrows.service';
import { BorrowReqDto } from './dtos/borrow.req.dto';
import { Throttle } from '@nestjs/throttler';
import { Perms } from 'src/common/decorators/perms.decorator';
import { Perm } from 'src/shared/enums/perm.enum';

@ApiTags('Borrow')
@ApiBearerAuth()
@Roles(Role.USER)
@Perms(Perm.BORROW)
@Controller('borrows')
export class BorrowsController {
    constructor(private readonly borrowsService: BorrowsService) {}

    @Throttle({ default: { limit: 1, ttl: 2000 } })
    @Post(':bookId')
    async borrowBook(
        @Request() req: RequestHeader,
        @Param('bookId') bookId: string,
        @Body() borrowReqDto: BorrowReqDto,
    ) {
        return this.borrowsService.borrowBook(
            req.user.sub,
            bookId,
            borrowReqDto,
        );
    }
}
