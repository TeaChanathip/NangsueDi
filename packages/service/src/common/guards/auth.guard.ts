import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';
import { UsersCollService } from '../mongodb/usersdb/services/users.collection.service';
import { JwtUserPayload } from '../../shared/interfaces/jwt-user.payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private userCollService: UsersCollService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if the route is public from @PublicRoute()
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();
        const token: string | undefined = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        let userPayload: JwtUserPayload;
        try {
            userPayload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
        } catch {
            throw new UnauthorizedException();
        }

        const user = await this.userCollService.findById(userPayload.sub);
        if (!user) {
            throw new NotFoundException();
        }

        if (userPayload.tokenVersion !== user.tokenVersion) {
            throw new HttpException(
                'The token version does not match',
                HttpStatus.UNAUTHORIZED,
            );
        }

        // Put the payload into the "request", so that we can access it later
        // Note: "request" was passed by reference
        request['user'] = userPayload;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
