import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';

@Injectable()
export class AuthService {
    constructor(
        private usersCollectionService: UsersCollectionService,
        private jwtService: JwtService,
    ) {}

    async login(email: string, password: string): Promise<any> {
        const user = await this.usersCollectionService.findByEmail(email);

        if (!user) {
            throw new HttpException(
                'The email or password is incorrect',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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
