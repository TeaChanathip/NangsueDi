import { Body, Controller, Delete, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserUpdateReqDto } from './dtos/user.update.req.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDeleteReqDto } from './dtos/user.delete.req.dto';
import { UsersChangePasswordReqDto } from './dtos/users.change-password.req.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch('update-profile')
    async updateProfile(
        @Request() req: any,
        @Body() userUpdateReqDto: UserUpdateReqDto,
    ) {
        return await this.usersService.updateProfile(
            req?.user?.sub,
            userUpdateReqDto,
        );
    }

    @Roles(Role.USER)
    @Delete('delete-profile')
    async deleteProfile(
        @Request() req: any,
        @Body() userDeleteReqDto: UserDeleteReqDto,
    ) {
        return await this.usersService.deleteProfile(
            req?.user?.sub,
            userDeleteReqDto.password,
        );
    }

    @Patch('change-password')
    async changePassword(
        @Request() req: any,
        @Body() usersChangePasswordReqDto: UsersChangePasswordReqDto,
    ) {
        return await this.usersService.changePassword(
            req?.user?.sub,
            usersChangePasswordReqDto,
        );
    }
}
