import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export function cvtToObjectId(id: string, name: string) {
    try {
        return new Types.ObjectId(id);
    } catch {
        throw new HttpException(
            `${name} must be a mongodb id`,
            HttpStatus.BAD_REQUEST,
        );
    }
}
