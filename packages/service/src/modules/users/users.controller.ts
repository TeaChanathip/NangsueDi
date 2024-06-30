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
import { UsersService } from './users.service';
import { UserUpdateReqDto } from './dtos/user.update.req.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDeleteReqDto } from './dtos/user.delete.req.dto';
import { UsersChangePasswordReqDto } from './dtos/users.change-password.req.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RequestHeader } from 'src/shared/interfaces/request-header.interface';
import { UserAddrDto } from './dtos/user.address.dto';
import { UserAddrUpdateReqDto } from './dtos/user-address.update.req.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile')
    async getProfile(@Request() req: RequestHeader) {
        return await this.usersService.getProfile(req.user.sub);
    }

    @Patch('profile')
    async updateProfile(
        @Request() req: RequestHeader,
        @Body() userUpdateReqDto: UserUpdateReqDto,
    ) {
        return await this.usersService.updateProfile(
            req.user.sub,
            userUpdateReqDto,
        );
    }

    @Roles(Role.USER)
    @Delete('profile')
    async deleteProfile(
        @Request() req: RequestHeader,
        @Body() userDeleteReqDto: UserDeleteReqDto,
    ) {
        return await this.usersService.deleteProfile(
            req.user.sub,
            userDeleteReqDto.password,
        );
    }

    @Patch('password')
    async changePassword(
        @Request() req: RequestHeader,
        @Body() usersChangePasswordReqDto: UsersChangePasswordReqDto,
    ) {
        return await this.usersService.changePassword(
            req.user.sub,
            usersChangePasswordReqDto,
        );
    }

    @Get('address')
    async getAddresses(@Request() req: RequestHeader) {
        return this.usersService.getAddresses(req.user.sub);
    }

    @Post('address')
    async addAddress(
        @Request() req: RequestHeader,
        @Body() userAddrDto: UserAddrDto,
    ) {
        return this.usersService.addAddress(req.user.sub, userAddrDto);
    }

    @Patch('address/:addrId')
    async updateAddress(
        @Request() req: RequestHeader,
        @Param('addrId') addrId: string,
        @Body() userAddrUpdateReqDto: UserAddrUpdateReqDto,
    ) {
        return await this.usersService.updateAddress(
            req.user.sub,
            addrId,
            userAddrUpdateReqDto,
        );
    }

    @Delete('address:addrId')
    async removeAddress(
        @Request() req: RequestHeader,
        @Param('addrId') addrId: string,
    ) {
        return await this.usersService.removeAddress(req.user.sub, addrId);
    }
}
