import { Body, Controller, Delete, Get, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserUpdateReqDto } from './dtos/user.update.req.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDeleteReqDto } from './dtos/user.delete.req.dto';
import { UsersChangePasswordReqDto } from './dtos/users.change-password.req.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { RequestHeader } from 'src/shared/interfaces/request-header.interface';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private usersCollectionService: UsersCollectionService,
    ) {}

    @Get('profile')
    async getProfile(@Request() req: RequestHeader) {
        return await this.usersCollectionService.getUser(req.user.sub);
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
}
