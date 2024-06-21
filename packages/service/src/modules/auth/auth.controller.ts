import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto } from './dtos/auth.login.dto';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { AuthRegisterDto } from './dtos/auth.register.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @PublicRoute()
    @Post('register')
    async register(@Body() authRegisterDto: AuthRegisterDto) {
        return await this.authService.register(authRegisterDto);
    }

    @PublicRoute()
    @Post('login')
    async login(@Body() authLoginDto: AuthLoginDto) {
        return await this.authService.login(
            authLoginDto.email,
            authLoginDto.password,
        );
    }
}
