import { Types } from 'mongoose';

export interface BookRes {
    _id: Types.ObjectId;
    title: string;
    author?: string;
    description?: string;
    publishedAt?: number;
    registeredAt: number;
    updatedAt?: number;
    total: number;
    borrowed: number;
    genres?: number[];
    coverUrl?: string;
}
