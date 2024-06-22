import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginReqDto } from './dtos/auth.login.req.dto';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { AuthRegisterReqDto } from './dtos/auth.register.req.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @PublicRoute()
    @Post('register')
    async register(@Body() authRegisterReqDto: AuthRegisterReqDto) {
        return await this.authService.register(authRegisterReqDto);
    }

    @PublicRoute()
    @Post('login')
    async login(@Body() authLoginReqDto: AuthLoginReqDto) {
        return await this.authService.login(authLoginReqDto);
    }
}
