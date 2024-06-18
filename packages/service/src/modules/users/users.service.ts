import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/shared/dtos/user.dto';

@Injectable()
export class UsersService {
    private readonly mockUser: UserDto[] = [
        {
            userId: '1',
            email: 'user1@gmail.com',
            password: '111111',
        },
        {
            userId: '2',
            email: 'user1@gmail.com',
            password: '222222',
        },
        {
            userId: '3',
            email: 'user3@gmail.com',
            password: '333333',
        },
    ];

    findByEmail(email: string) {
        return this.mockUser.find((user) => user.email === email);
    }
}
