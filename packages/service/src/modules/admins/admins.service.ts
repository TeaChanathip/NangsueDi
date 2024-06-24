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
import { AdminsUnsusUserReqDto } from './dtos/admins.unsuspend-user.req.dto';
import { AdminsDeleteUserReqDto } from './dtos/admins.delete-user.req.dto';

@Injectable()
export class AdminsService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersPermsCollService: UsersPermsCollService,
    ) {}

    async verifyUser(userId: string): Promise<UserFiltered> {
        const userObjectId = this.cvt2ObjectId(userId);

        const user = await this.usersCollService.findById(userObjectId);
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

        const userPermsSaveDto: UserPermsSaveDto = {
            userId: userObjectId,
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
            userObjectId,
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
        const userObjectId = this.cvt2ObjectId(
            adminsEditUserPermsReqDto.userId,
        );

        const editUserPermsDto = { ...adminsEditUserPermsReqDto };
        delete editUserPermsDto.userId;

        const userPerms = await this.usersPermsCollService.updateByUserId(
            userObjectId,
            editUserPermsDto,
        );
        if (!userPerms) {
            throw new InternalServerErrorException();
        }

        return filterUserRes(
            await this.usersCollService.findById(userObjectId),
            userPerms,
        );
    }

    async suspendUser(
        adminsSusUserReqDto: AdminsSusUserReqDto,
    ): Promise<UserFiltered> {
        const userObjectId = this.cvt2ObjectId(adminsSusUserReqDto.userId);

        const user = await this.usersCollService.findById(userObjectId);
        if (!user) {
            throw new NotFoundException();
        }
        if (user.suspendedAt) {
            throw new HttpException(
                'The user was already suspended',
                HttpStatus.BAD_REQUEST,
            );
        }

        const suspendedUser = await this.usersCollService.suspend(
            userObjectId,
            getCurrentUnix(),
        );
        if (!suspendedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getWithPerms(userObjectId);
    }

    async unsuspendUser(userId: string): Promise<UserFiltered> {
        const userObjectId = this.cvt2ObjectId(userId);

        const user = await this.usersCollService.findById(userObjectId);
        if (!user) {
            throw new NotFoundException();
        }
        if (!user.suspendedAt) {
            throw new HttpException(
                'The user was not suspended',
                HttpStatus.BAD_REQUEST,
            );
        }

        const unsuspendedUser =
            await this.usersCollService.unsuspend(userObjectId);
        if (!unsuspendedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getWithPerms(userObjectId);
    }

    async deleteUser(adminsDeleteUserReqDto: AdminsDeleteUserReqDto) {
        const userObjectId = this.cvt2ObjectId(adminsDeleteUserReqDto.userId);

        const user = await this.usersCollService.findById(userObjectId);
        if (!user) {
            throw new NotFoundException();
        }
        if (user.permissions) {
            throw new HttpException(
                'Cannot delete verified user',
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.usersCollService.delete(userObjectId);
    }

    private cvt2ObjectId(id: string): Types.ObjectId {
        let userObjectId: Types.ObjectId;
        try {
            userObjectId = new Types.ObjectId(id);
        } catch {
            throw new HttpException(
                'The userId format is invalid',
                HttpStatus.BAD_REQUEST,
            );
        }

        return userObjectId;
    }
}
