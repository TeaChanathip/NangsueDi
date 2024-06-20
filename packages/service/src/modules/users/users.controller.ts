import { Body, Controller, Patch, Post, Request } from '@nestjs/common';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { UserRegisterDto } from './dtos/user-register.dto';
import { UsersService } from './users.service';
import { UserEditDto } from './dtos/user-edit.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @PublicRoute()
    @Post('register')
    register(@Body() userRegisterDto: UserRegisterDto) {
        return this.usersService.register(userRegisterDto);
    }

    @ApiBearerAuth()
    @Patch('edit-profile')
    editProfile(@Request() req: any, @Body() userEditDto: UserEditDto) {
        return this.usersService.editProfile(req?.user?.sub, userEditDto);
    }
}
