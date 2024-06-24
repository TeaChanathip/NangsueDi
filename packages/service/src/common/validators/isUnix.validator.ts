import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUnix', async: false })
export class IsUnixConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        // Check if the value is a number
        if (typeof value !== 'number' || isNaN(value)) {
            return false;
        }

        // Check if the value is an integer
        if (!Number.isInteger(value)) {
            return false;
        }

        // Check if the value is within the range of valid Unix timestamps (in seconds)
        // Valid range: 01 January 1970 00:00:00 UTC to 19 January 2038 03:14:07 UTC
        const minTimestamp = 0; // 01 January 1970 00:00:00 UTC
        const maxTimestamp = 2147483647; // 19 January 2038 03:14:07 UTC

        return value >= minTimestamp && value <= maxTimestamp;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid Unix timestamp.';
    }
}

export function IsUnix(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUnix',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsUnixConstraint,
        });
    };
}
