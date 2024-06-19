import { Injectable } from '@nestjs/common';
import { UsersCollectionService } from './users-collection/users-collection.service';

@Injectable()
export class MongodbService {
    public usersDb: UsersCollectionService;
    constructor(usersDb: UsersCollectionService) {
        this.usersDb = usersDb;
    }
}
