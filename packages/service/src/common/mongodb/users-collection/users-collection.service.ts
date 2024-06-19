import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from './schemas/users.schema';
import { Document, Model } from 'mongoose';
import { UserPermissionsModel } from './schemas/user-permissions.schema';
import { User } from 'src/shared/interfaces/user.interface';
import { UserSaveDto } from './dtos/user-save.dto';

@Injectable()
export class UsersCollectionService {
    constructor(
        @InjectModel(UsersModel.name)
        private readonly usersModel: Model<UsersModel>,
        @InjectModel(UserPermissionsModel.name)
        private readonly userPermissionsModel: Model<UserPermissionsModel>,
    ) {}

    findByEmail(email: string): Promise<User> {
        return this.usersModel.findOne({ email });
    }

    saveNewUser(userSaveDto: UserSaveDto): Promise<Document> {
        const newUser = new this.usersModel(userSaveDto);
        return newUser.save();
    }
}
