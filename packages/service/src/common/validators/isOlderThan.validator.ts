import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { calculateAge } from '../../shared/utils/calculateAge';

@ValidatorConstraint({ name: 'isOlderThan', async: false })
export class IsOlderThanConstraint implements ValidatorConstraintInterface {
    validate(value: any, args?: ValidationArguments): boolean {
        if (typeof value !== 'number' || isNaN(value)) {
            return false;
        }

        if (!Number.isInteger(value)) {
            return false;
        }

        const age = calculateAge(value);

        return age >= 12;
    }

    defaultMessage(args: ValidationArguments) {
        return 'The age must be at least 12 years';
    }
}

export function IsOlderThan(
    age: number,
    validationOptions?: ValidationOptions,
) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isOlderThan',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsOlderThanConstraint,
        });
    };
}
