import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserAddrsRes } from 'src/common/mongodb/usersdb/interfaces/user-addresses.res.interface';
import { UsersAddrsCollService } from 'src/common/mongodb/usersdb/services/users-addresses.collection.service';
import { UsersCollService } from 'src/common/mongodb/usersdb/services/users.collection.service';
import { UserAddrDto } from '../dtos/user.address.dto';
import { UserAddrUpdateReqDto } from '../dtos/user-address.update.req.dto';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';

@Injectable()
export class UsersAddrsService {
    constructor(
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

        const addr = await this.usersAddrsCollService.saveNew(userAddrDto);
        if (!addr) {
            throw new InternalServerErrorException();
        }

        const newUser = await this.usersCollService.addAddress(
            userId,
            addr._id,
        );
        if (!newUser) {
            throw new InternalServerErrorException();
        }

        return addr;
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

        const deletedAddr =
            await this.usersAddrsCollService.removeById(addrObjId);
        if (!deletedAddr) {
            throw new InternalServerErrorException();
        }

        const newUser = await this.usersCollService.removeAddress(
            userId,
            deletedAddr._id,
        );
        if (!newUser) {
            throw new InternalServerErrorException();
        }

        return deletedAddr;
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
        if (!user.addresses.find((id) => String(id) === String(addrId))) {
            throw new HttpException(
                'The user does not own this address',
                HttpStatus.BAD_REQUEST,
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

        return { user, borrows };
    }
}
