import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AnyKeys, AnyObject } from 'mongoose';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { UsersModel } from '../schemas/users.schema';

export class PasswordUpdateDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsUnix()
    tokenVersion: number;

    @IsOptional()
    $unset?: AnyKeys<UsersModel> & AnyObject;
}
