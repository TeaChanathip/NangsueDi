import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRegisterDto } from 'src/shared/dtos/user-register.dto';
import { MongodbService } from 'src/common/mongodb/mongodb.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private mongodbService: MongodbService,
    ) {}

    @PublicRoute()
    // @HttpCode(HttpStatus.OK)
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

    @PublicRoute()
    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() userRegisterDto: UserRegisterDto) {
        return this.mongodbService.usersDb.register(userRegisterDto);
    }
}
