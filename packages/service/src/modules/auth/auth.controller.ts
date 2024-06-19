import { Body, Controller, Post } from '@nestjs/common';
import { UserLoginDto } from './dtos/user-login.dto';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { MongodbService } from 'src/common/mongodb/mongodb.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private mongodbService: MongodbService,
    ) {}

    @PublicRoute()
    @Post('login')
    signIn(@Body() userLoginDto: UserLoginDto) {
        return this.authService.login(
            userLoginDto.email,
            userLoginDto.password,
        );
    }

    // @ApiBearerAuth()
    // @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
}
