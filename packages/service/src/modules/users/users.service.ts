import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Roles } from 'src/shared/enums/roles.enum';
import { UserEditDto } from './dtos/user-edit.dto';
import { User } from 'src/shared/interfaces/user.interface';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersCollectionService: UsersCollectionService,
    ) {}

    async register(userRegisterDto: UserRegisterDto): Promise<User> {
        const user = await this.usersCollectionService.findByEmail(
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
            registeredAt: getCurrentUnix(),
        };

        return await this.usersCollectionService.saveNewUser(payload);
    }

    async editProfile(userId: Types.ObjectId, userEditDto: UserEditDto) {
        if (!userId) {
            throw new NotFoundException();
        }

        const user = await this.usersCollectionService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        const payload = {
            ...userEditDto,
            updatedAt: getCurrentUnix(),
        };

        return await this.usersCollectionService.editUser(userId, payload);
    }
}
