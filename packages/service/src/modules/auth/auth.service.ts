import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MongodbService } from 'src/common/mongodb/mongodb.service';

@Injectable()
export class AuthService {
    constructor(
        private mongodbService: MongodbService,
        private jwtService: JwtService,
    ) {}

    async login(email: string, password: string): Promise<any> {
        const user = await this.mongodbService.usersDb.findByEmail(email);

        if (!user) {
            throw new HttpException(
                'The email or password is incorrect',
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (await bcrypt.compare(password, user.password)) {
            throw new HttpException(
                'The email or password is incorrect',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const payload = { sub: user._id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
