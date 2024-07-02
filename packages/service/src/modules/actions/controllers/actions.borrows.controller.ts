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
import { RequestHeader } from 'src/shared/interfaces/request-header.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { Perms } from 'src/common/decorators/perms.decorator';
import { Perm } from 'src/shared/enums/perm.enum';
import { ActBorrowsReqDto } from '../dtos/actions.borrows.req.dto';
import { ActBorrowsQueryReqDto } from '../dtos/actions.borrows.query.req.dto';

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
        @Query() actBorrowsQueryReqDto: ActBorrowsQueryReqDto,
    ) {
        return await this.actionsBorrowService.getBorrows(
            req.user.sub,
            actBorrowsQueryReqDto,
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
