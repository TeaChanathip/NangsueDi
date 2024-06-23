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
import { AdminsEditUserPermissionsDto } from './dtos/admins.edit-user-permissions.req.dto';

@Injectable()
export class AdminsService {
    constructor(private usersCollectionService: UsersCollectionService) {}

    async verifyUser(userId: string): Promise<UserFiltered> {
        const userObjectId = this.cvtString2ObjectId(userId);

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

        // Save a Permissions document
        const permissions =
            await this.usersCollectionService.saveNewPermissions(
                userPermissionsSaveDto,
            );
        if (!permissions) {
            throw new InternalServerErrorException();
        }

        // Update a permissions to User document
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

    async editUserPermissions(
        adminsEditUserPermissionsDto: AdminsEditUserPermissionsDto,
    ): Promise<UserFiltered> {
        const { userId, canBorrow, canReview } = adminsEditUserPermissionsDto;
        const userObjectId = this.cvtString2ObjectId(userId);

        const userPermissionsRes =
            await this.usersCollectionService.editUserPermissions(
                userObjectId,
                canBorrow,
                canReview,
            );
        if (!userPermissionsRes) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollectionService.getUser(userObjectId);
    }

    private cvtString2ObjectId(id: string) {
        let objectId: Types.ObjectId;
        try {
            objectId = new Types.ObjectId(id);
        } catch {
            throw new HttpException(
                'The userId format is invalid',
                HttpStatus.BAD_REQUEST,
            );
        }

        return objectId;
    }
}
