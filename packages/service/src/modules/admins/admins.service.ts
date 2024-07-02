import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { UsersCollService } from 'src/common/mongodb/usersdb/services/users.collection.service';
import { UsersPermsCollService } from 'src/common/mongodb/usersdb/services/users-permissions.collection.service';
import { UserPermsSaveDto } from 'src/common/mongodb/usersdb/dtos/user-permissions.save.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { Role } from 'src/shared/enums/role.enum';
import { AdminsEditUserPermsReqDto } from './dtos/admins.edit-user-permissions.req.dto';
import { AdminsSusUserReqDto } from './dtos/admins.suspend-user.req.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { AdminsDeleteUserReqDto } from './dtos/admins.delete-user.req.dto';
import { AdminsGetUsersReqDto } from './dtos/admins.get-users.req.dto';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { filterUserRes } from 'src/shared/utils/filterUserRes';
import { InjectConnection } from '@nestjs/mongoose';
import { transaction } from 'src/shared/utils/mongo.transaction';
import { UserRes } from 'src/common/mongodb/usersdb/interfaces/user.res.interface';
import { UsersAddrsCollService } from 'src/common/mongodb/usersdb/services/users-addresses.collection.service';

@Injectable()
export class AdminsService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly usersCollService: UsersCollService,
        private readonly usersPermsCollService: UsersPermsCollService,
        private readonly usersAddrsCollService: UsersAddrsCollService,
    ) {}

    async verifyUser(userId: string): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckRole(userObjId, Role.USER);
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

        return transaction(this.connection, async (session) => {
            // Save a Permissions document
            const userPerms = await this.usersPermsCollService.saveNew(
                userPermsSaveDto,
                session,
            );
            if (!userPerms) {
                throw new InternalServerErrorException();
            }

            // Update a permissions to User document
            const updatedUser = await this.usersCollService.addPermissions(
                userObjId,
                userPerms._id,
                session,
            );
            if (!updatedUser) {
                throw new InternalServerErrorException();
            }

            return filterUserRes(updatedUser, userPerms);
        });
    }

    async editUserPermissions(
        userId: string,
        adminsEditUserPermsReqDto: AdminsEditUserPermsReqDto,
    ): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        await this.getUserAndCheckRole(userObjId, Role.USER);

        const userPerms = await this.usersPermsCollService.updateByUserId(
            userObjId,
            adminsEditUserPermsReqDto,
        );
        if (!userPerms) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getUserFiltered(userObjId);
    }

    async suspendUser(
        userId: string,
        adminsSusUserReqDto: AdminsSusUserReqDto,
    ): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckRole(userObjId, [
            Role.USER,
            Role.MANAGER,
        ]);
        if (user.suspendedAt) {
            throw new HttpException(
                'The user was already suspended',
                HttpStatus.BAD_REQUEST,
            );
        }

        const currentUnix = getCurrentUnix();
        const suspendedUser = await this.usersCollService.suspend(
            userObjId,
            currentUnix,
            currentUnix,
        );
        if (!suspendedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getUserFiltered(userObjId);
    }

    async unsuspendUser(userId: string): Promise<UserFiltered> {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckRole(userObjId, [
            Role.USER,
            Role.MANAGER,
        ]);
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

        return await this.usersCollService.getUserFiltered(userObjId);
    }

    async deleteUser(
        userId: string,
        adminsDeleteUserReqDto: AdminsDeleteUserReqDto,
    ) {
        const userObjId = cvtToObjectId(userId, 'userId');
        const user = await this.getUserAndCheckRole(userObjId, [
            Role.USER,
            Role.MANAGER,
        ]);
        if (user.permissions) {
            throw new HttpException(
                'Cannot delete verified user',
                HttpStatus.BAD_REQUEST,
            );
        }

        return transaction(this.connection, async (session) => {
            // Delete user's addresses if available
            const { addresses } = user;
            if (addresses) {
                const deletedAddrs = await Promise.all(
                    addresses.map(async ({ _id: addrId }) => {
                        return await this.usersAddrsCollService.deleteById(
                            addrId,
                            session,
                        );
                    }),
                );
                if (!deletedAddrs || deletedAddrs.includes(null)) {
                    throw new InternalServerErrorException();
                }
            }

            const deletedUser = await this.usersCollService.delete(
                userObjId,
                session,
            );
            if (!deletedUser) {
                throw new InternalServerErrorException();
            }

            return filterUserRes(deletedUser);
        });
    }

    async getUser(userId: string) {
        const userObjId = cvtToObjectId(userId, 'userId');

        return await this.usersCollService.getUserFiltered(userObjId);
    }

    async searchUsers(adminsGetUsersReqDto: AdminsGetUsersReqDto) {
        return await this.usersCollService.query(adminsGetUsersReqDto);
    }

    private async getUserAndCheckRole(
        userId: Types.ObjectId,
        allowedRoles: Role[] | Role,
    ): Promise<UserRes> {
        const user = await this.usersCollService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        if (
            (Array.isArray(allowedRoles) &&
                !allowedRoles.includes(user.role)) ||
            (!Array.isArray(allowedRoles) && allowedRoles !== user.role)
        ) {
            throw new HttpException(
                `The action on the '${user.role}' role is not allowed`,
                HttpStatus.BAD_REQUEST,
            );
        }

        return user;
    }
}
