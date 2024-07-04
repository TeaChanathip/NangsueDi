import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersAddressesModel } from '../schemas/users-addresses.schema';
import { ClientSession, Model, Types } from 'mongoose';
import { UserAddrDto } from '../../../../modules/users/dtos/user.address.dto';
import { UserAddrsRes } from '../interfaces/user-addresses.res.interface';
import { UserAddrUpdateReqDto } from '../../../../modules/users/dtos/user-address.update.req.dto';

@Injectable()
export class UsersAddrsCollService {
    constructor(
        @InjectModel(UsersAddressesModel.name)
        private readonly userAddrsModel: Model<UsersAddressesModel>,
    ) {}

    async saveNew(
        userAddrDto: UserAddrDto,
        session?: ClientSession,
    ): Promise<UserAddrsRes> {
        const userAddr = new this.userAddrsModel(userAddrDto);
        return await userAddr.save({ session });
    }

    async updateById(
        addrId: Types.ObjectId,
        userAddrUpdateReqDto: UserAddrUpdateReqDto,
        session?: ClientSession,
    ): Promise<UserAddrsRes> {
        return await this.userAddrsModel
            .findByIdAndUpdate(addrId, userAddrUpdateReqDto, { new: true })
            .session(session);
    }

    async deleteById(
        addrId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserAddrsRes> {
        return await this.userAddrsModel
            .findByIdAndDelete(addrId)
            .session(session);
    }
}
