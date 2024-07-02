import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { ActionsReturnsService } from '../services/actions.returns.service';
import { Throttle } from '@nestjs/throttler';
import { RequestHeader } from 'src/shared/interfaces/request-header.interface';
import { ReturnsQueryReqDto } from '../../../common/mongodb/returnsdb/dtos/returns.query.req.dto';

@ApiTags('Action-Return')
@ApiBearerAuth()
@Roles(Role.USER)
@Controller('actions/returns')
export class ActionsReturnsController {
    constructor(private actionsReturnsService: ActionsReturnsService) {}

    @Get()
    async getReturns(
        @Request() req: RequestHeader,
        @Query() ReturnsQueryReqDto: ReturnsQueryReqDto,
    ) {
        return await this.actionsReturnsService.getReturns(
            req.user.sub,
            ReturnsQueryReqDto,
        );
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

    @Delete(':returnId')
    async deleteReturn(
        @Request() req: RequestHeader,
        @Param('returnId') returnId: string,
    ) {
        return await this.actionsReturnsService.deleteReturn(
            req.user.sub,
            returnId,
        );
    }
}
