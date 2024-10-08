import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { MgrRejectReqDto } from './dtos/managers.reject.req.dto';
import { Throttle } from '@nestjs/throttler';
import { ManagersService } from './managers.service';
import { MgrBrwQueryReqDto } from '../../common/mongodb/borrowsdb/dtos/borrows.query.req.dto';
import { MgrRetQueryReqDto } from '../../common/mongodb/returnsdb/dtos/returns.query.req.dto';

@ApiTags('Manager')
@Throttle({ default: { limit: 1, ttl: 1200 } })
@ApiBearerAuth()
@Roles(Role.MANAGER, Role.ADMIN)
@Controller('managers')
export class ManagersController {
    constructor(private managersService: ManagersService) {}

    @Get('get-borrows')
    async getBorrows(@Query() mgrBrwQueryReqDto: MgrBrwQueryReqDto) {
        return await this.managersService.getBorrows(mgrBrwQueryReqDto);
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

    @Get('get-returns')
    async getReturns(@Query() mgrRetQueryReqDto: MgrRetQueryReqDto) {
        return await this.managersService.getReturns(mgrRetQueryReqDto);
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
