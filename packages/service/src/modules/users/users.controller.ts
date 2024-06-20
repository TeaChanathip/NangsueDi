import { Body, Controller, Delete, Patch, Post, Request } from '@nestjs/common';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { UserRegisterDto } from './dtos/user-register.dto';
import { UsersService } from './users.service';
import { UserEditDto } from './dtos/user-edit.dto';
import { ApiBearerAuth, ApiBody, ApiProperty } from '@nestjs/swagger';
import { UserDeleteDto } from './dtos/user-delete.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @PublicRoute()
    @Post('register')
    async register(@Body() userRegisterDto: UserRegisterDto) {
        return await this.usersService.register(userRegisterDto);
    }

    @ApiBearerAuth()
    @Patch('edit-profile')
    async editProfile(@Request() req: any, @Body() userEditDto: UserEditDto) {
        return await this.usersService.editProfile(req?.user?.sub, userEditDto);
    }

    @ApiBearerAuth()
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
