import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { UserAddrsRes } from '../../../common/mongodb/usersdb/interfaces/user-addresses.res.interface';
import { UsersAddrsCollService } from '../../../common/mongodb/usersdb/services/users-addresses.collection.service';
import { UsersCollService } from '../../../common/mongodb/usersdb/services/users.collection.service';
import { UserAddrDto } from '../dtos/user.address.dto';
import { UserAddrUpdateReqDto } from '../dtos/user-address.update.req.dto';
import { cvtToObjectId } from '../../../shared/utils/cvtToObjectId';
import { BorrowsCollService } from '../../../common/mongodb/borrowsdb/borrows.collection.service';
import { transaction } from '../../../shared/utils/mongo.transaction';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class UsersAddrsService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly usersCollService: UsersCollService,
        private readonly usersAddrsCollService: UsersAddrsCollService,
        private readonly borrowsCollService: BorrowsCollService,
    ) {}

    async getAddresses(userId: Types.ObjectId): Promise<UserAddrsRes[]> {
        return await this.usersCollService.getAddresses(userId);
    }

    async addAddress(
        userId: Types.ObjectId,
        userAddrDto: UserAddrDto,
    ): Promise<UserAddrsRes> {
        const user = await this.usersCollService.findById(userId);
        if (user.addresses && user.addresses.length >= 5) {
            throw new HttpException(
                'The user can have at most 5 addresses',
                HttpStatus.BAD_REQUEST,
            );
        }

        return transaction(this.connection, async (session) => {
            const addr = await this.usersAddrsCollService.saveNew(
                userAddrDto,
                session,
            );
            if (!addr) {
                throw new InternalServerErrorException();
            }

            const newUser = await this.usersCollService.addAddress(
                userId,
                addr._id,
                session,
            );
            if (!newUser) {
                throw new InternalServerErrorException();
            }

            return addr;
        });
    }

    async updateAddress(
        userId: Types.ObjectId,
        addrId: string,
        userAddrUpdateReqDto: UserAddrUpdateReqDto,
    ): Promise<UserAddrsRes> {
        const addrObjId = cvtToObjectId(addrId, 'addrId');

        await this.checkAddrAndBorrows(userId, addrObjId);

        return this.usersAddrsCollService.updateById(
            addrObjId,
            userAddrUpdateReqDto,
        );
    }

    async deleteAddress(
        userId: Types.ObjectId,
        addrId: string,
    ): Promise<UserAddrsRes> {
        const addrObjId = cvtToObjectId(addrId, 'addrId');

        await this.checkAddrAndBorrows(userId, addrObjId);

        return transaction(this.connection, async (session) => {
            const deletedAddr = await this.usersAddrsCollService.deleteById(
                addrObjId,
                session,
            );
            if (!deletedAddr) {
                throw new InternalServerErrorException();
            }

            const newUser = await this.usersCollService.removeAddress(
                userId,
                deletedAddr._id,
                session,
            );
            if (!newUser) {
                throw new InternalServerErrorException();
            }

            return deletedAddr;
        });
    }

    private async checkAddrAndBorrows(
        userId: Types.ObjectId,
        addrId: Types.ObjectId,
    ) {
        // Check if user own this address or not
        const user = await this.usersCollService.findById(userId);
        if (!user) {
            throw new InternalServerErrorException();
        }
        if (
            !user?.addresses ||
            !user.addresses.find(({ _id }) => String(_id) === String(addrId))
        ) {
            throw new HttpException(
                'The user does not own this address',
                HttpStatus.FORBIDDEN,
            );
        }

        // Check if user has any borrow request
        const borrows = await this.borrowsCollService.findByUserId(userId);
        if (
            borrows &&
            borrows.find((borrow) => String(borrow.addrId) === String(addrId))
        ) {
            throw new HttpException(
                'Cannot delete or edit address with pending borrow requests',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
