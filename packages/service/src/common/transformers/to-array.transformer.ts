import { Transform, TransformOptions } from 'class-transformer';

export interface ConvertOptions {
    /** @default 'string' */
    type?: 'number' | 'string';
}

export function ToArray(
    options?: ConvertOptions,
    transformOptions?: TransformOptions,
): (target: any, key: string) => void {
    return Transform(({ value }: any) => {
        try {
            if (Array.isArray(value)) {
                switch (options?.type) {
                    case 'number':
                        return value.map((item) => Number(item));
                    default:
                        return value.map((item) => String(item));
                }
            }

            switch (options?.type) {
                case 'number':
                    return [Number(value)];
                default:
                    return [String(value)];
            }
        } catch {
            return value;
        }
    }, transformOptions);
}
