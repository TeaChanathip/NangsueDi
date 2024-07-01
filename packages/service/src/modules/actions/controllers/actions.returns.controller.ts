import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { ActionsReturnsService } from '../services/actions.returns.service';
import { Throttle } from '@nestjs/throttler';
import { RequestHeader } from 'src/shared/interfaces/request-header.interface';

@ApiTags('Action-Return')
@ApiBearerAuth()
@Roles(Role.USER)
@Controller('actions/returns')
export class ActionsReturnsController {
    constructor(private actionsReturnsService: ActionsReturnsService) {}

    @Get()
    async getReturns(@Request() req: RequestHeader) {
        return await this.actionsReturnsService.getReturns(req.user.sub);
    }

    @Throttle({ default: { limit: 1, ttl: 2000 } })
    @Post(':borrowId')
    async returnBook(
        @Request() req: RequestHeader,
        @Param('borrowId') borrowId: string,
    ) {
        return await this.actionsReturnsService.returnBook(
            req.user.sub,
            borrowId,
        );
    }
}
