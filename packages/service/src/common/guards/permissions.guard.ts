import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Perm } from '../../shared/enums/perm.enum';
import { PERMS_KEY } from '../decorators/perms.decorator';
import { JwtUserPayload } from '../../shared/interfaces/jwt-user.payload.interface';
import { UsersCollService } from '../mongodb/usersdb/services/users.collection.service';

@Injectable()
export class PermsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersCollService: UsersCollService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPerms = this.reflector.getAllAndOverride<Perm[]>(
            PERMS_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredPerms) {
            return true;
        }

        // Get user payload from header
        const userPayload: JwtUserPayload | null = context
            .switchToHttp()
            .getRequest()?.user;
        if (!userPayload) {
            throw new NotFoundException();
        }

        // Check if permissions
        const userId = userPayload.sub;
        const { permissions } =
            await this.usersCollService.getUserFiltered(userId);
        if (!permissions) {
            throw new HttpException(
                'The user does not have permission for this action',
                HttpStatus.FORBIDDEN,
            );
        }

        // Check if all required permissions are satisfied
        requiredPerms.forEach((perm) => {
            if (!permissions[perm]) {
                throw new HttpException(
                    'The user does not have permission for this action',
                    HttpStatus.FORBIDDEN,
                );
            }
        });

        return true;
    }
}
