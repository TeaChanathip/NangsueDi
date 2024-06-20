import { Body, Controller, Post } from '@nestjs/common';
import { UserLoginDto } from './dtos/user-login.dto';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @PublicRoute()
    @Post('login')
    async login(@Body() userLoginDto: UserLoginDto) {
        return await this.authService.login(
            userLoginDto.email,
            userLoginDto.password,
        );
    }
}
