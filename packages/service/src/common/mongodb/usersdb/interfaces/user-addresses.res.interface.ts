import { Types } from 'mongoose';

export interface UserAddrsRes {
    _id: Types.ObjectId;
    address: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
}
