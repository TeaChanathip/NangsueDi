import { Body, Controller, Delete, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEditDto } from './dtos/user.edit.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDeleteDto } from './dtos/user.delete.dto';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch('edit-profile')
    async editProfile(@Request() req: any, @Body() userEditDto: UserEditDto) {
        return await this.usersService.editProfile(req?.user?.sub, userEditDto);
    }

    @Delete()
    async deleteProfile(
        @Request() req: any,
        @Body() userDeleteDto: UserDeleteDto,
    ) {
        return await this.usersService.deleteProfile(
            req?.user?.sub,
            userDeleteDto.password,
        );
    }
}
