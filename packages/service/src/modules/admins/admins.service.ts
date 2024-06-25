import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersCollService } from 'src/common/mongodb/usersdb/services/users.collection.service';
import { UsersPermsCollService } from 'src/common/mongodb/usersdb/services/users-permissions.collection.service';
import { UserPermsSaveDto } from 'src/common/mongodb/usersdb/dtos/user-permissions.save.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { Role } from 'src/shared/enums/role.enum';
import { AdminsEditUserPermsReqDto } from './dtos/admins.edit-user-permissions.req.dto';
import { filterUserRes } from 'src/shared/utils/filterUserRes';
import { AdminsSusUserReqDto } from './dtos/admins.suspend-user.req.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { AdminsDeleteUserReqDto } from './dtos/admins.delete-user.req.dto';
import { AdminsGetUsersReqDto } from './dtos/admins.get-users.req.dto';

@Injectable()
export class AdminsService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersPermsCollService: UsersPermsCollService,
    ) {}

    async verifyUser(userId: Types.ObjectId): Promise<UserFiltered> {
        const user = await this.getUserAndCheckAdmin(userId);
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

        const userPermsSaveDto: UserPermsSaveDto = {
            userId,
            canBorrow: true,
            canReview: true,
        };

        // Save a Permissions document
        const userPerms =
            await this.usersPermsCollService.saveNew(userPermsSaveDto);
        if (!userPerms) {
            throw new InternalServerErrorException();
        }

        // Update a permissions to User document
        const updatedUser = await this.usersCollService.addPermissions(
            userId,
            userPerms._id,
        );
        if (!updatedUser) {
            throw new InternalServerErrorException();
        }

        return filterUserRes(updatedUser, userPerms);
    }

    async editUserPermissions(
        adminsEditUserPermsReqDto: AdminsEditUserPermsReqDto,
    ): Promise<UserFiltered> {
        const { userId } = adminsEditUserPermsReqDto;
        await this.getUserAndCheckAdmin(userId);

        const editUserPermsDto = { ...adminsEditUserPermsReqDto };
        delete editUserPermsDto.userId;

        const userPerms = await this.usersPermsCollService.updateByUserId(
            userId,
            editUserPermsDto,
        );
        if (!userPerms) {
            throw new InternalServerErrorException();
        }

        return filterUserRes(
            await this.usersCollService.findById(userId),
            userPerms,
        );
    }

    async suspendUser(
        adminsSusUserReqDto: AdminsSusUserReqDto,
    ): Promise<UserFiltered> {
        const { userId } = adminsSusUserReqDto;
        const user = await this.getUserAndCheckAdmin(userId);
        if (user.suspendedAt) {
            throw new HttpException(
                'The user was already suspended',
                HttpStatus.BAD_REQUEST,
            );
        }

        const suspendedUser = await this.usersCollService.suspend(
            userId,
            getCurrentUnix(),
        );
        if (!suspendedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getWithPerms(userId);
    }

    async unsuspendUser(userId: Types.ObjectId): Promise<UserFiltered> {
        const user = await this.getUserAndCheckAdmin(userId);
        if (!user.suspendedAt) {
            throw new HttpException(
                'The user was not suspended',
                HttpStatus.BAD_REQUEST,
            );
        }

        const unsuspendedUser = await this.usersCollService.unsuspend(userId);
        if (!unsuspendedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getWithPerms(userId);
    }

    async deleteUser(adminsDeleteUserReqDto: AdminsDeleteUserReqDto) {
        const { userId } = adminsDeleteUserReqDto;
        const user = await this.getUserAndCheckAdmin(userId);
        if (user.permissions) {
            throw new HttpException(
                'Cannot delete verified user',
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.usersCollService.delete(userId);
    }

    async getUsers(adminsGetUsersReqDto: AdminsGetUsersReqDto) {
        return await this.usersCollService.query(adminsGetUsersReqDto);
    }

    async getUser(userId: string) {
        let userObjectId: Types.ObjectId;
        try {
            userObjectId = new Types.ObjectId(userId);
        } catch {
            throw new HttpException(
                'userId must be a mongodb id',
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.usersCollService.findById(userObjectId);
    }

    private async getUserAndCheckAdmin(userId: Types.ObjectId) {
        const user = await this.usersCollService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }
        if (user.role === Role.ADMIN) {
            throw new HttpException(
                'Cannot perform this action on an Admin user',
                HttpStatus.BAD_REQUEST,
            );
        }

        return user;
    }
}
