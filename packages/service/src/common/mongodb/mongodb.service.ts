import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class MongodbService {
    public usersDb: UsersService;
    constructor(usersDb: UsersService) {
        this.usersDb = usersDb;
    }
}
