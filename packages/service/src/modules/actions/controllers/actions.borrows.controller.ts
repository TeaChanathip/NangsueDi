import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { ActionsBorrowsService } from '../services/actions.borrows.service';
import { RequestHeader } from '../../../shared/interfaces/request-header.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { Perms } from '../../../common/decorators/perms.decorator';
import { Perm } from '../../../shared/enums/perm.enum';
import { ActBorrowsReqDto } from '../dtos/actions.borrows.req.dto';
import { BorrowsQueryReqDto } from '../../../common/mongodb/borrowsdb/dtos/borrows.query.req.dto';
import { ActBrwGetNonRetReqDto } from '../dtos/actions.borrows.get-non-returned.req.dto';

@ApiTags('Action-Borrow')
@ApiBearerAuth()
@Roles(Role.USER)
@Perms(Perm.BORROW)
@Controller('actions/borrows')
export class ActionsBorrowsController {
    constructor(private actionsBorrowService: ActionsBorrowsService) {}

    @Get()
    async getBorrows(
        @Request() req: RequestHeader,
        @Query() borrowsQueryReqDto: BorrowsQueryReqDto,
    ) {
        return await this.actionsBorrowService.getBorrows(
            req.user.sub,
            borrowsQueryReqDto,
        );
    }

    @Get('non-returned')
    async getNonReturned(
        @Request() req: RequestHeader,
        @Query() actBrwGetNonRetReqDto: ActBrwGetNonRetReqDto,
    ) {
        return await this.actionsBorrowService.getNonReturned(
            req.user.sub,
            actBrwGetNonRetReqDto,
        );
    }

    @Delete(':borrowId')
    async deleteBorrow(
        @Request() req: RequestHeader,
        @Param('borrowId') borrowId: string,
    ) {
        return await this.actionsBorrowService.deleteBorrow(
            req.user.sub,
            borrowId,
        );
    }

    @Throttle({ default: { limit: 1, ttl: 2000 } })
    @Post(':bookId')
    async borrow(
        @Request() req: RequestHeader,
        @Param('bookId') bookId: string,
        @Body() actBorrowsReqDto: ActBorrowsReqDto,
    ) {
        return this.actionsBorrowService.borrow(
            req.user.sub,
            bookId,
            actBorrowsReqDto,
        );
    }
}
