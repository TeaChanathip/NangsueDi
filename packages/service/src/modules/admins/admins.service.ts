import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { UserPermissionsDto } from './dtos/user.permissions.dto';
import { UserResponse } from 'src/shared/interfaces/user.interface';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class AdminsService {
    constructor(private usersCollectionService: UsersCollectionService) {}

    async verifyUser(userId: Types.ObjectId): Promise<UserResponse> {
        const user = await this.usersCollectionService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }
        if (user.role !== Role.USER) {
            throw new HttpException(
                'Cannot verify non-user role',
                HttpStatus.FORBIDDEN,
            );
        }
        if (user.permissions) {
            throw new HttpException(
                'This user was already verified',
                HttpStatus.BAD_REQUEST,
            );
        }

        const userPermissionsDto: UserPermissionsDto = {
            userId: userId,
            canBorrow: true,
            canReview: true,
        };

        const permissions =
            await this.usersCollectionService.saveNewPermissions(
                userPermissionsDto,
            );
        if (!permissions) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollectionService.addPermissionsToUser(
            userId,
            permissions._id,
        );
    }
}
