import { Types } from 'mongoose';

export interface BookRes {
    _id: Types.ObjectId;
    title: string;
    author?: string;
    description?: string;
    publishedAt?: number;
    registeredAt: number;
    totalNumber: number;
    remainNumber: number;
    genres?: number[];
}
