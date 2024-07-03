import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { MgrRejectReqDto } from './dtos/managers.reject.req.dto';
import { Throttle } from '@nestjs/throttler';
import { ManagersService } from './managers.service';
import { BorrowsQueryReqDto } from 'src/common/mongodb/borrowsdb/dtos/borrows.query.req.dto';
import { ReturnsQueryReqDto } from 'src/common/mongodb/returnsdb/dtos/returns.query.req.dto';

@ApiTags('Manager')
@Throttle({ default: { limit: 1, ttl: 1200 } })
@ApiBearerAuth()
@Roles(Role.MANAGER, Role.ADMIN)
@Controller('managers')
export class ManagersController {
    constructor(private managersService: ManagersService) {}

    @Get('get-borrows/:userId')
    @ApiParam({
        name: 'userId',
        required: false,
    })
    async getBorrows(
        @Query() borrowsQueryReqDto: BorrowsQueryReqDto,
        @Param('userId') userId?: string,
    ) {
        return await this.managersService.getBorrows(
            borrowsQueryReqDto,
            userId,
        );
    }

    @Patch('approve-borrow/:borrowId')
    async approveBorrow(@Param('borrowId') borrowId: string) {
        return await this.managersService.approveBorrow(borrowId);
    }

    @Patch('reject-borrow/:borrowId')
    async rejectBorrow(
        @Param('borrowId') borrowId: string,
        @Body() mgrRejectReqDto: MgrRejectReqDto,
    ) {
        return await this.managersService.rejectBorrow(
            borrowId,
            mgrRejectReqDto,
        );
    }

    @Get('get-returns/:userId')
    @ApiParam({
        name: 'userId',
        required: false,
    })
    async getReturns(
        @Query() returnsQueryReqDto: ReturnsQueryReqDto,
        @Param('userId') userId?: string,
    ) {
        return await this.managersService.getReturns(
            returnsQueryReqDto,
            userId,
        );
    }

    @Patch('approve-return/:returnId')
    async approveReturn(@Param('returnId') returnId: string) {
        return await this.managersService.approveReturn(returnId);
    }

    @Patch('reject-return/:returnId')
    async rejectReturn(
        @Param('returnId') returnId: string,
        @Body() mgrRejectReqDto: MgrRejectReqDto,
    ) {
        return await this.managersService.rejectReturn(
            returnId,
            mgrRejectReqDto,
        );
    }
}
