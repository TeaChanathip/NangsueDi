import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
} from '@nestjs/common';
import { RequestHeader } from '../../../shared/interfaces/request-header.interface';
import { UserAddrDto } from '../dtos/user.address.dto';
import { UsersAddrsService } from '../services/users.addresses.service';
import { UserAddrUpdateReqDto } from '../dtos/user-address.update.req.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';

@ApiTags('User-Address')
@ApiBearerAuth()
@Roles(Role.USER)
@Controller('users/address')
export class UsersAddrsController {
    constructor(private usersAddrsService: UsersAddrsService) {}

    @Get()
    async getAddresses(@Request() req: RequestHeader) {
        return this.usersAddrsService.getAddresses(req.user.sub);
    }

    @Post()
    async addAddress(
        @Request() req: RequestHeader,
        @Body() userAddrDto: UserAddrDto,
    ) {
        return this.usersAddrsService.addAddress(req.user.sub, userAddrDto);
    }

    @Patch(':addrId')
    async updateAddress(
        @Request() req: RequestHeader,
        @Param('addrId') addrId: string,
        @Body() userAddrUpdateReqDto: UserAddrUpdateReqDto,
    ) {
        return await this.usersAddrsService.updateAddress(
            req.user.sub,
            addrId,
            userAddrUpdateReqDto,
        );
    }

    @Delete(':addrId')
    async deleteAddress(
        @Request() req: RequestHeader,
        @Param('addrId') addrId: string,
    ) {
        return await this.usersAddrsService.deleteAddress(req.user.sub, addrId);
    }
}
