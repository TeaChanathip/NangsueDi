import { Transform, TransformOptions } from 'class-transformer';

export interface TrimOptions {
    /** @default 'both' */
    strategy?: 'start' | 'end' | 'both';

    /** @default false */
    each?: boolean;
}

export function Trim(
    options?: TrimOptions,
    transformOptions?: TransformOptions,
): (target: any, key: string) => void {
    return Transform(({ value }: any) => {
        if (Array.isArray(value) && options?.each) {
            return value.map((item) => {
                if ('string' !== typeof item) {
                    return item;
                }

                switch (options?.strategy) {
                    case 'start':
                        return item.trimStart();
                    case 'end':
                        return item.trimEnd();
                    default:
                        return item.trim();
                }
            });
        } else if ('string' === typeof value) {
            switch (options?.strategy) {
                case 'start':
                    return value.trimStart();
                case 'end':
                    return value.trimEnd();
                default:
                    return value.trim();
            }
        }
        return value;
    }, transformOptions);
}
