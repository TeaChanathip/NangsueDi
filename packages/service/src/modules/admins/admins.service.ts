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
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';

@Injectable()
export class AdminsService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersPermsCollService: UsersPermsCollService,
    ) {}

    async verifyUser(userId: string): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckAdmin(userObjId);
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
            userId: userObjId,
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
            userObjId,
            userPerms._id,
        );
        if (!updatedUser) {
            throw new InternalServerErrorException();
        }

        return filterUserRes(updatedUser, userPerms);
    }

    async editUserPermissions(
        userId: string,
        adminsEditUserPermsReqDto: AdminsEditUserPermsReqDto,
    ): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        await this.getUserAndCheckAdmin(userObjId);

        const userPerms = await this.usersPermsCollService.updateByUserId(
            userObjId,
            adminsEditUserPermsReqDto,
        );
        if (!userPerms) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getWithPerms(userObjId);
    }

    async suspendUser(
        userId: string,
        adminsSusUserReqDto: AdminsSusUserReqDto,
    ): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckAdmin(userObjId);
        if (user.suspendedAt) {
            throw new HttpException(
                'The user was already suspended',
                HttpStatus.BAD_REQUEST,
            );
        }

        const suspendedUser = await this.usersCollService.suspend(
            userObjId,
            getCurrentUnix(),
        );
        if (!suspendedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getWithPerms(userObjId);
    }

    async unsuspendUser(userId: string): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckAdmin(userObjId);
        if (!user.suspendedAt) {
            throw new HttpException(
                'The user was not suspended',
                HttpStatus.BAD_REQUEST,
            );
        }

        const unsuspendedUser =
            await this.usersCollService.unsuspend(userObjId);
        if (!unsuspendedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getWithPerms(userObjId);
    }

    async deleteUser(
        userId: string,
        adminsDeleteUserReqDto: AdminsDeleteUserReqDto,
    ) {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckAdmin(userObjId);
        if (user.permissions) {
            throw new HttpException(
                'Cannot delete verified user',
                HttpStatus.BAD_REQUEST,
            );
        }

        return filterUserRes(await this.usersCollService.delete(userObjId));
    }

    async getUsers(adminsGetUsersReqDto: AdminsGetUsersReqDto) {
        return await this.usersCollService.query(adminsGetUsersReqDto);
    }

    async getUser(userId: string) {
        const userObjId = cvtToObjectId(userId, 'userId');

        return await this.usersCollService.getWithPerms(userObjId);
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
