import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
} from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @ApiBearerAuth()
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
