import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersAddressesModel } from '../../schemas/users-addresses.schema';
import { Model, Types } from 'mongoose';
import { UserAddrDto } from 'src/modules/users/dtos/user.address.dto';
import { UserAddrsRes } from '../../interfaces/user-addresses.res.interface';
import { UserAddrUpdateReqDto } from 'src/modules/users/dtos/user-address.update.req.dto';

@Injectable()
export class UsersAddrsCollService {
    constructor(
        @InjectModel(UsersAddressesModel.name)
        private readonly userAddrsModel: Model<UsersAddressesModel>,
    ) {}

    async saveNew(userAddrDto: UserAddrDto): Promise<UserAddrsRes> {
        const userAddr = new this.userAddrsModel(userAddrDto);
        return await userAddr.save();
    }

    async updateById(
        addrId: Types.ObjectId,
        userAddrUpdateReqDto: UserAddrUpdateReqDto,
    ): Promise<UserAddrsRes> {
        return await this.userAddrsModel.findByIdAndUpdate(
            addrId,
            userAddrUpdateReqDto,
            { new: true },
        );
    }

    async removeById(addrId: Types.ObjectId): Promise<UserAddrsRes> {
        return await this.userAddrsModel.findByIdAndDelete(addrId);
    }
}
