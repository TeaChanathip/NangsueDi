import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    collection: 'UsersAddresses',
    autoCreate: true,
    versionKey: false,
})
export class UsersAddressesModel {
    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    subDistrict: string;

    @Prop({ required: true })
    district: string;

    @Prop({ required: true })
    province: string;

    @Prop({ required: true })
    postalCode: string;
}

export const UsersAddressesSchema =
    SchemaFactory.createForClass(UsersAddressesModel);
