import { FilterQuery } from 'mongoose';

export function unixFilterQuery(
    fieldName: string,
    timeBegin?: number,
    timeEnd?: number,
): FilterQuery<any> {
    return {
        ...(timeBegin !== undefined && {
            [fieldName]: { $gte: timeBegin },
        }),
        ...(timeEnd !== undefined && { [fieldName]: { $lte: timeEnd } }),
        ...(timeBegin === undefined &&
            timeEnd === undefined && { [fieldName]: { $exists: false } }),
    };
}
