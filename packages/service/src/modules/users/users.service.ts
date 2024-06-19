import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MongodbService } from 'src/common/mongodb/mongodb.service';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Roles } from 'src/shared/enums/roles.enum';
import { Document } from 'mongoose';
import { UserEditDto } from './dtos/user-edit.dto';

@Injectable()
export class UsersService {
    constructor(private readonly mongodbService: MongodbService) {}

    async register(userRegisterDto: UserRegisterDto): Promise<Document> {
        const user = await this.mongodbService.usersDb.findByEmail(
            userRegisterDto.email,
        );
        if (user) {
            throw new HttpException(
                'The email is already taken',
                HttpStatus.BAD_REQUEST,
            );
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(userRegisterDto.password, salt);

        const payload = {
            ...userRegisterDto,
            password: hash,
            role: Roles.USER,
            registeredAt: Math.floor(new Date().getTime() / 1000),
        };

        return await this.mongodbService.usersDb.saveNewUser(payload);
    }

    async editProfile(email: string, userEditDto: UserEditDto) {
        const user = await this.mongodbService.usersDb.findByEmail(email);
        if (!user) {
            throw new NotFoundException();
        }

        // I'll do it tmr, cause I'm so sleepy
    }
}
