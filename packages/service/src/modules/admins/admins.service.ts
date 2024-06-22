import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { UserPermissionsSaveDto } from '../../common/mongodb/users-collection/dtos/user-permissions.save.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class AdminsService {
    constructor(private usersCollectionService: UsersCollectionService) {}

    async verifyUser(userId: string): Promise<UserFiltered> {
        let userObjectId: Types.ObjectId;
        try {
            userObjectId = new Types.ObjectId(userId);
        } catch {
            throw new HttpException(
                'The userId format is invalid',
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = await this.usersCollectionService.findById(userObjectId);
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

        const userPermissionsSaveDto: UserPermissionsSaveDto = {
            userId: userObjectId,
            canBorrow: true,
            canReview: true,
        };

        const permissions =
            await this.usersCollectionService.saveNewPermissions(
                userPermissionsSaveDto,
            );
        if (!permissions) {
            throw new InternalServerErrorException();
        }

        const filteredUser =
            await this.usersCollectionService.addPermissionsToUser(
                userObjectId,
                permissions._id,
            );
        if (!filteredUser) {
            throw new InternalServerErrorException();
        }

        return filteredUser;
    }
}
