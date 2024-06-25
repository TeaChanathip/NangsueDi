import { Transform, TransformOptions } from 'class-transformer';

export interface SortOptions {
    /** @default 'asce' */
    order: 'desc' | 'asce';
}

export function SortArray(
    options?: SortOptions,
    transformOptions?: TransformOptions,
): (target: any, key: string) => void {
    return Transform(({ value }: any) => {
        if (!value.isArray()) {
            return value;
        }

        switch (options?.order) {
            case 'desc':
                return value.sort((a, b) => a - b);
            default:
                return value.trim();
        }
    }, transformOptions);
