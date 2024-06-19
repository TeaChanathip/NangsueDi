import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { UserRegisterDto } from './dtos/user-register.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @PublicRoute()
    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() userRegisterDto: UserRegisterDto) {
        return this.usersService.register(userRegisterDto);
    }
}
