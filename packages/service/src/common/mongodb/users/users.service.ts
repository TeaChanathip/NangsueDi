import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from './schemas/users.schema';
import { Model } from 'mongoose';
import { UserPermissionsModel } from './schemas/user-permissions.schema';
import { UserRegisterDto } from 'src/shared/dtos/user-register.dto';
import { Roles } from 'src/shared/enums/roles.enum';
import { User } from 'src/shared/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel.name)
        private readonly usersModel: Model<UsersModel>,
        @InjectModel(UserPermissionsModel.name)
        private readonly userPermissionsModel: Model<UserPermissionsModel>,
    ) {}

    async register(userRegisterDto: UserRegisterDto) {
        const user = await this.findByEmail(userRegisterDto.email);
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

        const newUser = new this.usersModel(payload);
        return await newUser.save();
    }

    findByEmail(email: string): Promise<User> {
        return this.usersModel.findOne({ email });
    }
}
