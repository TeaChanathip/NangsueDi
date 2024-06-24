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
import { AdminsEditUserPermsDto } from './dtos/admins.edit-user-permissions.req.dto';
import { filterUserRes } from 'src/shared/utils/filterUserRes';

@Injectable()
export class AdminsService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersPermsCollService: UsersPermsCollService,
    ) {}

    async verifyUser(userId: string): Promise<UserFiltered> {
        const userObjectId = this.cvtString2ObjectId(userId);

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
        adminsEditUserPermsDto: AdminsEditUserPermsDto,
    ): Promise<UserFiltered> {
        const userObjectId = this.cvtString2ObjectId(
            adminsEditUserPermsDto.userId,
        );

        const editUserPermsDto = { ...adminsEditUserPermsDto };
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
