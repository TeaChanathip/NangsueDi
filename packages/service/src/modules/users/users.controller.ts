import { Body, Controller, Delete, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEditDto } from './dtos/user.edit.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDeleteDto } from './dtos/user.delete.dto';
import { UserChangePasswordDto } from './dtos/user.change-password.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch('edit-profile')
    async editProfile(@Request() req: any, @Body() userEditDto: UserEditDto) {
        return await this.usersService.editProfile(req?.user?.sub, userEditDto);
    }

    @Roles(Role.USER)
    @Delete('delete-profile')
    async deleteProfile(
        @Request() req: any,
        @Body() userDeleteDto: UserDeleteDto,
    ) {
        return await this.usersService.deleteProfile(
            req?.user?.sub,
            userDeleteDto.password,
        );
    }

    @Patch('change-password')
    async changePassword(
        @Request() req: any,
        @Body() userChangePasswordDto: UserChangePasswordDto,
    ) {
        return await this.usersService.changePassword(
            req?.user?.sub,
            userChangePasswordDto,
        );
    }
}
