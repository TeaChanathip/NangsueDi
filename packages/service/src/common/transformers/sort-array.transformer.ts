import { Transform, TransformOptions } from 'class-transformer';

export interface SortOptions {
    /** @default 'asce' */
    order?: 'desc' | 'asce';

    /** @default 'number' */
    type?: 'number' | 'string';
}

export function SortArray(
    options?: SortOptions,
    transformOptions?: TransformOptions,
): (target: any, key: string) => void {
    return Transform(({ value }: any) => {
        if (!Array.isArray(value)) {
            return value;
        }

        const order = options?.order || 'asce';
        const type = options?.type || 'number';

        return value.sort((a: any, b: any) => {
            if (type === 'number') {
                return order === 'asce' ? a - b : b - a;
            }

            // string
            return order === 'asce' ? a.localeCompare(b) : b.localeCompare(a);
        });
    }, transformOptions);
}
